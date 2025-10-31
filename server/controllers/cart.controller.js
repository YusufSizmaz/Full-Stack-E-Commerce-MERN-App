import CartProductModel from "../models/cartproduct.model.js";
import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";

// Get cart items
export const getCartController = async (request, response) => {
  try {
    const userId = request.userId;

    if (!userId) {
      return response.status(400).json({
        message: "Kullanıcı ID'si bulunamadı",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findById(userId).populate({
      path: "shopping_cart",
      populate: {
        path: "productId",
      },
    });

    if (!user) {
      return response.status(404).json({
        message: "Kullanıcı bulunamadı",
        error: true,
        success: false,
      });
    }

    const cartItems = user.shopping_cart || [];

    return response.json({
      message: "Sepet başarıyla getirildi",
      data: cartItems,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Sunucu hatası oluştu",
      error: true,
      success: false,
    });
  }
};

// Add to cart
export const addToCartController = async (request, response) => {
  try {
    const userId = request.userId;
    const { productId, quantity = 1 } = request.body;

    if (!productId) {
      return response.status(400).json({
        message: "Ürün ID'si gereklidir",
        error: true,
        success: false,
      });
    }

    // Check if product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      return response.status(404).json({
        message: "Ürün bulunamadı",
        error: true,
        success: false,
      });
    }

    // Check if product is in stock
    if (product.stock < quantity) {
      return response.status(400).json({
        message: `Yeterli stok yok. Mevcut stok: ${product.stock}`,
        error: true,
        success: false,
      });
    }

    // Check if item already exists in cart
    const user = await UserModel.findById(userId).populate("shopping_cart");
    const existingCartItem = user.shopping_cart.find((item) => {
      return item.productId && item.productId.toString() === productId;
    });

    if (existingCartItem) {
      // Update quantity
      const newQuantity = existingCartItem.quantity + quantity;
      if (product.stock < newQuantity) {
        return response.status(400).json({
          message: `Yeterli stok yok. Mevcut stok: ${product.stock}`,
          error: true,
          success: false,
        });
      }

      await CartProductModel.findByIdAndUpdate(existingCartItem._id, {
        quantity: newQuantity,
      });

      return response.json({
        message: "Sepete eklendi",
        error: false,
        success: true,
      });
    }

    // Create new cart item
    const newCartItem = new CartProductModel({
      productId,
      quantity,
      userId,
    });

    const savedCartItem = await newCartItem.save();

    // Add to user's shopping cart
    await UserModel.findByIdAndUpdate(userId, {
      $push: { shopping_cart: savedCartItem._id },
    });

    return response.json({
      message: "Ürün sepete eklendi",
      data: savedCartItem,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Sunucu hatası oluştu",
      error: true,
      success: false,
    });
  }
};

// Update cart item quantity
export const updateCartItemController = async (request, response) => {
  try {
    const userId = request.userId;
    const { cartItemId, quantity } = request.body;

    if (!cartItemId || quantity === undefined) {
      return response.status(400).json({
        message: "Sepet öğesi ID'si ve miktar gereklidir",
        error: true,
        success: false,
      });
    }

    if (quantity <= 0) {
      return response.status(400).json({
        message: "Miktar 0'dan büyük olmalıdır",
        error: true,
        success: false,
      });
    }

    // Verify cart item belongs to user
    const cartItem = await CartProductModel.findById(cartItemId);
    if (!cartItem || cartItem.userId.toString() !== userId) {
      return response.status(403).json({
        message: "Bu sepet öğesini güncelleme yetkiniz yok",
        error: true,
        success: false,
      });
    }

    // Check product stock
    const product = await ProductModel.findById(cartItem.productId);
    if (!product) {
      return response.status(404).json({
        message: "Ürün bulunamadı",
        error: true,
        success: false,
      });
    }

    if (product.stock < quantity) {
      return response.status(400).json({
        message: `Yeterli stok yok. Mevcut stok: ${product.stock}`,
        error: true,
        success: false,
      });
    }

    await CartProductModel.findByIdAndUpdate(cartItemId, {
      quantity,
    });

    return response.json({
      message: "Sepet güncellendi",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Sunucu hatası oluştu",
      error: true,
      success: false,
    });
  }
};

// Remove from cart
export const removeFromCartController = async (request, response) => {
  try {
    const userId = request.userId;
    const { cartItemId } = request.body;

    if (!cartItemId) {
      return response.status(400).json({
        message: "Sepet öğesi ID'si gereklidir",
        error: true,
        success: false,
      });
    }

    // Verify cart item belongs to user
    const cartItem = await CartProductModel.findById(cartItemId);
    if (!cartItem || cartItem.userId.toString() !== userId) {
      return response.status(403).json({
        message: "Bu sepet öğesini silme yetkiniz yok",
        error: true,
        success: false,
      });
    }

    // Remove from user's shopping cart
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { shopping_cart: cartItemId },
    });

    // Delete cart item
    await CartProductModel.findByIdAndDelete(cartItemId);

    return response.json({
      message: "Ürün sepetten kaldırıldı",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Sunucu hatası oluştu",
      error: true,
      success: false,
    });
  }
};

// Clear cart
export const clearCartController = async (request, response) => {
  try {
    const userId = request.userId;

    const user = await UserModel.findById(userId);
    if (!user) {
      return response.status(404).json({
        message: "Kullanıcı bulunamadı",
        error: true,
        success: false,
      });
    }

    // Delete all cart items
    await CartProductModel.deleteMany({ userId });

    // Clear user's shopping cart
    await UserModel.findByIdAndUpdate(userId, {
      shopping_cart: [],
    });

    return response.json({
      message: "Sepet temizlendi",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Sunucu hatası oluştu",
      error: true,
      success: false,
    });
  }
};

