import ProductModel from "../models/product.model.js";

export const createProductController = async (request, response) => {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    } = request.body;

    if (
      !name ||
      !image[0] ||
      !category[0] ||
      !subCategory[0] ||
      !unit ||
      !price ||
      !description
    ) {
      return response.status(400).json({
        message: "Enter required fields",
        error: true,
        success: false,
      });
    }
    const product = new ProductModel({
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    });
    const saveProduct = await product.save();

    return response.json({
      message: "Product Created Successfully",
      data: saveProduct,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getProductController = async (request, response) => {
  try {
    let { page, limit, search } = request.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const query = search
      ? {
          $text: {
            $search: search,
          },
        }
      : {};

    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('category', 'name')
        .populate('subCategory', 'name'),
      ProductModel.countDocuments(query),
    ]);

    return response.json({
      message: "Product data",
      error: false,
      success: true,
      totalCount: totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      data: data,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getProductByCategory = async (request, response) => {
  try {
    const { id } = request.query;

    if (!id) {
      return response.status(400).json({
        message: "Provide category id",
        error: true,
        success: false,
      });
    }

    // Handle both single ID and array of IDs
    const categoryIds = Array.isArray(id) ? id : [id];

    const product = await ProductModel.find({
      category: { $in: categoryIds },
    })
      .limit(15)
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .sort({ createdAt: -1 });

    return response.json({
      message: "category product list",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Get single product by ID
export const getProductDetailsController = async (request, response) => {
  try {
    const { productId } = request.params;

    const product = await ProductModel.findById(productId)
      .populate('category', 'name image')
      .populate('subCategory', 'name image');

    if (!product) {
      return response.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    return response.json({
      message: "Product details",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Update product
export const updateProductController = async (request, response) => {
  try {
    const { _id } = request.body;

    if (!_id) {
      return response.status(400).json({
        message: "Product ID is required",
        error: true,
        success: false,
      });
    }

    const updateProduct = await ProductModel.findByIdAndUpdate(
      _id,
      {
        ...request.body,
      },
      { new: true, runValidators: true }
    );

    if (!updateProduct) {
      return response.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    return response.json({
      message: "Product updated successfully",
      data: updateProduct,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Delete product
export const deleteProductController = async (request, response) => {
  try {
    const { _id } = request.body;

    if (!_id) {
      return response.status(400).json({
        message: "Product ID is required",
        error: true,
        success: false,
      });
    }

    const deleteProduct = await ProductModel.findByIdAndDelete(_id);

    if (!deleteProduct) {
      return response.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    return response.json({
      message: "Product deleted successfully",
      data: deleteProduct,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Toggle product publish status
export const updateProductPublishController = async (request, response) => {
  try {
    const { _id } = request.body;

    if (!_id) {
      return response.status(400).json({
        message: "Product ID is required",
        error: true,
        success: false,
      });
    }

    const product = await ProductModel.findById(_id);

    if (!product) {
      return response.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    // Toggle publish status
    product.publish = !product.publish;
    await product.save();

    return response.json({
      message: `Product ${product.publish ? 'published' : 'unpublished'} successfully`,
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Search products with advanced filters
export const searchProductController = async (request, response) => {
  try {
    const {
      search,
      category,
      subCategory,
      minPrice,
      maxPrice,
      inStock,
      page = 1,
      limit = 10
    } = request.query;

    const query = {};

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category) {
      query.category = { $in: Array.isArray(category) ? category : [category] };
    }

    // SubCategory filter
    if (subCategory) {
      query.subCategory = { $in: Array.isArray(subCategory) ? subCategory : [subCategory] };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Stock filter
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [data, totalCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('category', 'name')
        .populate('subCategory', 'name'),
      ProductModel.countDocuments(query),
    ]);

    return response.json({
      message: "Search results",
      error: false,
      success: true,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / Number(limit)),
      currentPage: Number(page),
      data: data,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
