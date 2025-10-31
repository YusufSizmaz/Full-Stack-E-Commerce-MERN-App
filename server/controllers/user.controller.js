import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import sendEmail from "./../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import dotenv from "dotenv";
import generatedAccessToken from "./../utils/generatedAccessToken.js";
import generatedRefreshToken from "./../utils/generatedRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import generetedOtp from "../utils/generetedOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import jwt from "jsonwebtoken";

dotenv.config();

export async function registerUserController(request, response) {
  try {
    const { name, email, password, username } = request.body;

    if (!name || !email || !password || !username) {
      return response.status(400).json({
        message: "Provide name, email, password, and username",
        error: true,
        success: false,
      });
    }

    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      const message =
        existingUser.email === email
          ? "Already registered email"
          : "Username already taken";
      return response.json({ message, error: true, success: false });
    }

    const hashPassword = await bcryptjs.hash(
      password,
      await bcryptjs.genSalt(10)
    );

    const newUser = new UserModel({
      name,
      email,
      password: hashPassword,
      username,
    });
    const savedUser = await newUser.save();

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${savedUser._id}`;

    await sendEmail({
      sendTo: email,
      subject: "Verify email from binkeyit",
      html: verifyEmailTemplate(name, verifyEmailUrl),
    });

    return response.json({
      message: "User registered successfully",
      error: false,
      success: true,
      data: savedUser,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

export async function verifyEmailController(request, response) {
  try {
    const { code } = request.body;
    const user = await UserModel.findById(code);

    if (!user) {
      return response
        .status(400)
        .json({ message: "Invalid code", error: true, success: false });
    }

    user.verify_email = true;
    await user.save();

    return response.json({
      message: "Email verified successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

//Login Controller
export async function loginController(request, response) {
  try {
    const { emailOrUsername, password } = request.body;

    if (!emailOrUsername || !password) {
      return response.status(400).json({
        message: "Provide email or username and password",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return response.status(400).json({
        message: "User not register.",
        error: true,
        success: false,
      });
    }
    if (user.status !== "Active") {
      return response.status(400).json({
        message: "Contact to Admin",
        error: true,
        success: false,
      });
    }

    const checkPassword = await bcryptjs.compare(password, user.password);
    if (!checkPassword) {
      return response.status(400).json({
        message: "Check your password",
        error: true,
        success: false,
      });
    }

    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generatedRefreshToken(user._id);

    const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
      last_login_date: new Date(),
    });

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    response.cookie("accessToken", accessToken, cookiesOption);
    response.cookie("refreshToken", refreshToken, cookiesOption);

    return response.json({
      message: "Login successfully",
      error: false,
      success: true,
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Logout Controller
export async function logoutController(request, response) {
  try {
    const userid = request.userId; // middleware
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    response.clearCookie("accessToken", cookiesOption);
    response.clearCookie("refreshToken", cookiesOption);

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, {
      refresh_token: "",
    });

    return response.json({
      message: "Logout successfully",
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
}

//Upload user avatar
export async function uploadAvatar(request, response) {
  try {
    const userId = request.userId; // auth middleware
    const image = request.file; // multer middleware

    const upload = await uploadImageCloudinary(image);

    const updateUser = await UserModel.findByIdAndUpdate(userId, {
      avatar: upload.url,
    });

    return response.json({
      message: "Profil fotoğrafı başarılı olarak güncellendi. ",
      success: true,
      error: false,
      data: {
        _id: userId,
        avatar: upload.url,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      succes: false,
    });
  }
}

// Update User Details
export async function updateUserDetails(request, response) {
  try {
    const userId = request.userId; // Auth middleware
    const { name, email, mobile, password } = request.body;

    let hashPassword = "";

    if (password) {
      const salt = await bcryptjs.genSalt(10);
      hashPassword = await bcryptjs.hash(password, salt);
    }

    const updateUser = await UserModel.updateOne(
      { _id: userId },
      {
        ...(name && { name: name }),
        ...(email && { email: email }),
        ...(mobile && { mobile: mobile }),
        ...(password && { password: hashPassword }),
      }
    );
    // findByIdAndUpdate veritabanında güncellemesi için.

    return response.json({
      message: "Kullanıcı bilgileri güncellendi.",
      error: false,
      success: true,
      data: updateUser,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Forgot password
export async function forgotPasswordController(request, response) {
  try {
    const { emailOrUsername } = request.body;

    const user = await UserModel.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return response.status(400).json({
        message: "Email or username not available",
        error: true,
        success: false,
      });
    }

    const otp = generetedOtp();
    const expireTime = new Date(Date.now() + 60 * 60 * 1000);

    await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_expiry: expireTime.toISOString(),
    });

    await sendEmail({
      sendTo: user.email,
      subject: "Forgot Password From Binkeyit",
      html: forgotPasswordTemplate({
        name: user.name,
        otp: otp,
      }),
    });

    return response.json({
      message: "Check your email.",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

//Sifre degistirme onaylama
export async function verifyForgotPasswordOtp(request, response) {
  /// 📩 Kullanıcı şifre sıfırlama talebi gönderir → OTP alır → Bu API'ye girilen OTP'yi yollar ↓↓
  //  → Doğrulama başarılıysa yeni şifre belirleyebilir. ✅
  try {
    const { emailOrUsername, otp } = request.body;

    if (!emailOrUsername || !otp) {
      return response.status(400).json({
        message: "Provide required field email, otp.",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return response.status(400).json({
        message: "Email or username not available",
        error: true,
        success: false,
      });
    }

    const currentTime = new Date().toISOString();

    if (user.forgot_password_expiry < currentTime) {
      return response.status(400).json({
        message: "Otp is expired",
        error: true,
        success: false,
      });
    }

    if (otp !== user.forgot_password_otp) {
      return response.status(400).json({
        message: "Invalid otp",
        error: true,
        success: false,
      });
    }

    const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
      forgot_password_otp: "",
      forgot_password_expiry: "",
    });

    return response.json({
      message: "Verify otp successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

// Reset the password
export async function resetpassword(request, response) {
  try {
    const { emailOrUsername, newPassword, confirmPassword } = request.body.data;

    if (!emailOrUsername || !newPassword || !confirmPassword) {
      return response.status(400).json({
        message: "Provide required fields email , newPassword, confirmPassword",
      });
    }

    const user = await UserModel.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return response.status(400).json({
        message: "Email is not available",
        error: true,
        success: false,
      });
    }

    if (newPassword !== confirmPassword) {
      return response.status(400).json({
        message: "newPassword and confirmPassword",
        error: true,
        succes: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(newPassword, salt);

    const update = await UserModel.findByIdAndUpdate(user._id, {
      password: hashPassword,
    });

    return response.json({
      message: "Şifre Güncellendi.",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Refresh Token controller
export async function refreshToken(request, response) {
  try {
    const refreshToken =
      request.cookies.refreshToken ||
      request?.headers?.authorizition?.split(" ")[1];

    if (!refreshToken) {
      return response.status(402).json({
        message: "Invalid Token.",
        error: true,
        success: false,
      });
    }

    const verifyToken = await jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN
    );

    if (!verifyToken) {
      return response.status(401).json({
        message: "token is expired",
        error: true,
        success: false,
      });
    }

    const userId = verifyToken._id;
    const newAccessToken = await generatedAccessToken(userId);

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    response.cookie("accessToken", newAccessToken, cookiesOption);

    return response.json({
      message: "New Access Token Generated",
      error: false,
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Kullanıcı bilgisi almak
export async function UserDetails(request, response) {
  try {
    const userId = request.userId;
    console.log("User ID:", userId); // Debug log

    if (!userId) {
      return response.status(400).json({
        message: "User ID not found in request",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findById(userId).select(
      "-password -refresh_token"
    );

    if (!user) {
      return response.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    return response.json({
      message: "user details",
      data: user,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("UserDetails Error:", error); // Debug log
    return response.status(500).json({
      message: error.message || "Something is wrong",
      error: true,
      success: false,
    });
  }
}

// ============ ADMIN ONLY ENDPOINTS ============

// Get all users (Admin)
export async function getAllUsersController(request, response) {
  try {
    const { page = 1, limit = 10, search, role, status } = request.query;

    const query = {};

    // Search by name, email, or username
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by role
    if (role) {
      query.role = role;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, totalCount] = await Promise.all([
      UserModel.find(query)
        .select("-password -refresh_token -forgot_password_otp")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      UserModel.countDocuments(query),
    ]);

    return response.json({
      message: "All users retrieved successfully",
      data: users,
      totalCount,
      totalPages: Math.ceil(totalCount / Number(limit)),
      currentPage: Number(page),
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
}

// Update user status (Admin)
export async function updateUserStatusController(request, response) {
  try {
    const { userId, status } = request.body;

    if (!userId || !status) {
      return response.status(400).json({
        message: "User ID and status are required",
        error: true,
        success: false,
      });
    }

    const validStatuses = ["Active", "Inactive", "Suspended"];
    if (!validStatuses.includes(status)) {
      return response.status(400).json({
        message: `Status must be one of: ${validStatuses.join(", ")}`,
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select("-password -refresh_token");

    if (!user) {
      return response.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    return response.json({
      message: `User status updated to ${status}`,
      data: user,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
}

// Update user role (Admin)
export async function updateUserRoleController(request, response) {
  try {
    const { userId, role } = request.body;
    const adminId = request.userId;

    if (!userId || !role) {
      return response.status(400).json({
        message: "User ID and role are required",
        error: true,
        success: false,
      });
    }

    // Prevent admin from changing their own role
    if (userId === adminId) {
      return response.status(400).json({
        message: "You cannot change your own role",
        error: true,
        success: false,
      });
    }

    const validRoles = ["ADMIN", "USER"];
    if (!validRoles.includes(role)) {
      return response.status(400).json({
        message: `Role must be one of: ${validRoles.join(", ")}`,
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password -refresh_token");

    if (!user) {
      return response.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    return response.json({
      message: `User role updated to ${role}`,
      data: user,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
}

// Delete user (Admin)
export async function deleteUserController(request, response) {
  try {
    const { userId } = request.body;
    const adminId = request.userId;

    if (!userId) {
      return response.status(400).json({
        message: "User ID is required",
        error: true,
        success: false,
      });
    }

    // Prevent admin from deleting themselves
    if (userId === adminId) {
      return response.status(400).json({
        message: "You cannot delete your own account",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findByIdAndDelete(userId);

    if (!user) {
      return response.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    return response.json({
      message: "User deleted successfully",
      data: user,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
}

// Get user statistics (Admin)
export async function getUserStatsController(request, response) {
  try {
    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
      totalAdmins,
      verifiedUsers,
      unverifiedUsers,
    ] = await Promise.all([
      UserModel.countDocuments(),
      UserModel.countDocuments({ status: "Active" }),
      UserModel.countDocuments({ status: "Inactive" }),
      UserModel.countDocuments({ status: "Suspended" }),
      UserModel.countDocuments({ role: "ADMIN" }),
      UserModel.countDocuments({ verify_email: true }),
      UserModel.countDocuments({ verify_email: false }),
    ]);

    return response.json({
      message: "User statistics retrieved successfully",
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        suspendedUsers,
        totalAdmins,
        verifiedUsers,
        unverifiedUsers,
      },
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
}

// Get recent users (Admin)
export async function getRecentUsersController(request, response) {
  try {
    const { limit = 10 } = request.query;

    const users = await UserModel.find()
      .select("-password -refresh_token -forgot_password_otp")
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    return response.json({
      message: "Recent users retrieved successfully",
      data: users,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
}
