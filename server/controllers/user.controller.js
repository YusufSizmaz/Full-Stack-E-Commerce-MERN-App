import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import sendEmail from "./../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import dotenv from "dotenv";
import generatedAccessToken from "./../utils/generatedAccessToken.js";
import generatedRefreshToken from "./../utils/generatedRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
dotenv.config();

export async function registerUserController(request, response) {
  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({
        message: "provide email, name, password",
        error: true,
        sucess: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      return response.json({
        message: "Already register email",
        error: true,
        sucess: false,
      });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashPassword,
    };

    const newUser = new UserModel(payload);
    const save = await newUser.save();

    const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify email from binkeyit",
      html: verifyEmailTemplate(name, VerifyEmailUrl), // Doğru Kullanım
    });

    return response.json({
      message: "User register successfully",
      error: false,
      succeess: true,
      data: save,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      sucess: false,
    });
  }
}

export async function verifyEmailController(request, response) {
  try {
    const { code } = request.body;
    const user = await UserModel.findOne({ _id: code });

    if (!user) {
      return response
        .status(400)
        .json({ message: "Invalid code", error: true, success: false });
    }

    const updateUser = await UserModel.UpdateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );
    return response.json({
      message: "Verify email done",
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: true,
    });
  }
}

//Login Controller
export async function loginController(request, response) {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({
        message: "proivde email, password",
        error: true,
        succeess: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(400).json({
        message: "User not register.",
        error: true,
        succeess: false,
      });
    }
    if (user.status !== "Active") {
      return response.status(400).json({
        message: "Contact to Admin",
        error: true,
        succes: false,
      });
    }

    const checkPassword = await bcryptjs.compare(password, user.password);
    if (!checkPassword) {
      return response.status(400).json({
        message: "Check yout password",
        error: true,
        succes: false,
      });
    }

    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generatedRefreshToken(user._id);

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
      succeess: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      succeess: false,
    });
  }
}

//Upload user avatar
export async function uploadAvatar(request, response) {
  try {
    const image = request.file;

    const upload = await uploadImageCloudinary(image);

    return response.json({
      message: "upload profile",
      data: upload,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      succes: false,
    });
  }
}
