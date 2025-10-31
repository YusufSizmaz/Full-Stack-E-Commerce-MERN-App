import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    image: {
      type: [String],
      required: [true, "At least one product image is required"],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "Product must have at least one image",
      },
    },
    category: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "category",
        required: [true, "Category is required"],
      },
    ],
    subCategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subCategory",
        required: [true, "Subcategory is required"],
      },
    ],
    unit: {
      type: String,
      required: [true, "Unit is required"],
      trim: true,
      maxlength: [50, "Unit cannot exceed 50 characters"],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Stock must be an integer",
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    more_details: {
      type: Object,
      default: {},
    },
    publish: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Text index for search functionality
productSchema.index(
  {
    name: "text",
    description: "text",
  },
  {
    weights: {
      name: 10,
      description: 5,
    },
  }
);

// Additional indexes for better query performance
productSchema.index({ price: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ publish: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ discount: -1 });

// Compound indexes for common queries
productSchema.index({ category: 1, publish: 1 });
productSchema.index({ subCategory: 1, publish: 1 });
productSchema.index({ price: 1, publish: 1 });
productSchema.index({ stock: 1, publish: 1 });

// Virtual for final price after discount
productSchema.virtual("finalPrice").get(function () {
  return this.price - (this.price * this.discount) / 100;
});

// Virtual for stock status
productSchema.virtual("stockStatus").get(function () {
  if (this.stock === 0) return "Out of Stock";
  if (this.stock < 10) return "Low Stock";
  return "In Stock";
});

const ProductModel = mongoose.model("product", productSchema);

export default ProductModel;
