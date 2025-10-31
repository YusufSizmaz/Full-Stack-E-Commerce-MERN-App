import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Don't include password in queries by default
    },
    avatar: {
      type: String,
      default: "",
      match: [/^(https?:\/\/)|(^$)/, "Avatar must be a valid URL"],
    },
    mobile: {
      type: String,
      default: null,
      sparse: true, // Allow multiple null values
      match: [/^[+]?[\d\s-()]+$|^$/, "Please provide a valid mobile number"],
    },
    refresh_token: {
      type: String,
      default: "",
      select: false, // Don't include refresh token in queries by default
    },
    verify_email: {
      type: Boolean,
      default: false,
    },
    last_login_date: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ["Active", "Inactive", "Suspended"],
        message: "Status must be Active, Inactive, or Suspended",
      },
      default: "Active",
    },
    address_details: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "address",
      },
    ],
    shopping_cart: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "cartProduct",
      },
    ],
    orderHistory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "order",
      },
    ],
    forgot_password_otp: {
      type: String,
      default: null,
      select: false, // Don't include OTP in queries by default
    },
    forgot_password_expiry: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: {
        values: ["ADMIN", "USER"],
        message: "Role must be ADMIN or USER",
      },
      default: "USER",
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [
        /^[a-z0-9_-]+$/,
        "Username can only contain lowercase letters, numbers, hyphens and underscores",
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ status: 1 });
userSchema.index({ role: 1 });
userSchema.index({ verify_email: 1 });
userSchema.index({ createdAt: -1 });

// Compound index for common queries
userSchema.index({ email: 1, status: 1 });
userSchema.index({ role: 1, status: 1 });

// Methods
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.refresh_token;
  delete user.forgot_password_otp;
  return user;
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
