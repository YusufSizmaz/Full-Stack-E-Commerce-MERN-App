import Stripe from "stripe";
import CartProductModel from "../models/cartproduct.model.js";
import UserModel from "../models/user.model.js";
import OrderModel from "../models/order.model.js";
import dotenv from "dotenv";

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.warn("⚠️  STRIPE_SECRET_KEY bulunamadı! Stripe ödeme sistemi çalışmayacak.");
}

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

// Create payment intent
export const createPaymentIntentController = async (request, response) => {
  try {
    if (!stripe) {
      return response.status(500).json({
        message: "Stripe yapılandırması eksik. Lütfen STRIPE_SECRET_KEY'i .env dosyasına ekleyin.",
        error: true,
        success: false,
      });
    }

    const userId = request.userId;
    const { discountCode, deliveryAddressId } = request.body;

    if (!userId) {
      return response.status(400).json({
        message: "Kullanıcı ID'si bulunamadı",
        error: true,
        success: false,
      });
    }

    // Get user with cart
    const user = await UserModel.findById(userId).populate({
      path: "shopping_cart",
      populate: {
        path: "productId",
      },
    });

    if (!user || !user.shopping_cart || user.shopping_cart.length === 0) {
      return response.status(400).json({
        message: "Sepetiniz boş",
        error: true,
        success: false,
      });
    }

    // Calculate total amount
    let subtotal = 0;
    user.shopping_cart.forEach((item) => {
      if (item.productId) {
        const price = item.productId.price || 0;
        const discount = item.productId.discount || 0;
        const discountedPrice =
          discount > 0 ? price * (1 - discount / 100) : price;
        subtotal += discountedPrice * item.quantity;
      }
    });

    // Apply discount code if provided
    let discountAmount = 0;
    if (discountCode) {
      const discountCodes = {
        WELCOME10: { type: "percentage", value: 10 },
        SAVE20: { type: "percentage", value: 20 },
        FLAT500: { type: "fixed", value: 500 },
      };

      const discount = discountCodes[discountCode.toUpperCase()];
      if (discount) {
        if (discount.type === "percentage") {
          discountAmount = (subtotal * discount.value) / 100;
        } else {
          discountAmount = discount.value;
        }
      }
    }

    const totalAmount = Math.max(0, subtotal - discountAmount);

    // Convert to cents (Stripe uses smallest currency unit)
    const amountInCents = Math.round(totalAmount * 100);

    if (amountInCents < 50) {
      return response.status(400).json({
        message: "Minimum ödeme tutarı 0.50 TL'dir",
        error: true,
        success: false,
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "try",
      metadata: {
        userId: userId.toString(),
        discountCode: discountCode || "",
        deliveryAddressId: deliveryAddressId || "",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return response.json({
      message: "Ödeme intent'i oluşturuldu",
      data: {
        clientSecret: paymentIntent.client_secret,
        amount: totalAmount,
        subtotal,
        discountAmount,
      },
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Payment intent error:", error);
    return response.status(500).json({
      message: error.message || "Ödeme oluşturulurken hata oluştu",
      error: true,
      success: false,
    });
  }
};

// Confirm payment and create order
export const confirmPaymentController = async (request, response) => {
  try {
    if (!stripe) {
      return response.status(500).json({
        message: "Stripe yapılandırması eksik. Lütfen STRIPE_SECRET_KEY'i .env dosyasına ekleyin.",
        error: true,
        success: false,
      });
    }

    const userId = request.userId;
    const { paymentIntentId, deliveryAddressId } = request.body;

    if (!paymentIntentId) {
      return response.status(400).json({
        message: "Payment intent ID gereklidir",
        error: true,
        success: false,
      });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return response.status(400).json({
        message: "Ödeme başarısız",
        error: true,
        success: false,
      });
    }

    // Get user cart
    const user = await UserModel.findById(userId).populate({
      path: "shopping_cart",
      populate: {
        path: "productId",
      },
    });

    if (!user || !user.shopping_cart || user.shopping_cart.length === 0) {
      return response.status(400).json({
        message: "Sepetiniz boş",
        error: true,
        success: false,
      });
    }

    // Create orders for each cart item
    const orderPromises = user.shopping_cart.map(async (cartItem) => {
      if (!cartItem.productId) return null;

      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const order = new OrderModel({
        userId,
        orderId,
        productId: cartItem.productId._id,
        product_details: {
          name: cartItem.productId.name,
          image: cartItem.productId.image || [],
        },
        paymentId: paymentIntentId,
        payment_status: "success",
        delivery_address: deliveryAddressId || null,
        subTotalAmt: (cartItem.productId.price || 0) * cartItem.quantity,
        totalAmt: 
          (cartItem.productId.discount || 0) > 0
            ? (cartItem.productId.price || 0) *
              (1 - (cartItem.productId.discount || 0) / 100) *
              cartItem.quantity
            : (cartItem.productId.price || 0) * cartItem.quantity,
      });

      return order.save();
    });

    const orders = (await Promise.all(orderPromises)).filter(Boolean);

    // Add orders to user's orderHistory
    const orderIds = orders.map((order) => order._id);
    await UserModel.findByIdAndUpdate(userId, {
      $push: { orderHistory: { $each: orderIds } },
    });

    // Clear cart
    await CartProductModel.deleteMany({ userId });
    await UserModel.findByIdAndUpdate(userId, {
      shopping_cart: [],
    });

    return response.json({
      message: "Ödeme başarıyla tamamlandı",
      data: {
        orders,
        paymentIntentId,
      },
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Confirm payment error:", error);
    return response.status(500).json({
      message: error.message || "Ödeme onaylanırken hata oluştu",
      error: true,
      success: false,
    });
  }
};

