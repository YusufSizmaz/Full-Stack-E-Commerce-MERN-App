import { Router } from "express";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  refreshToken,
  registerUserController,
  resetpassword,
  updateUserDetails,
  uploadAvatar,
  UserDetails,
  verifyEmailController,
  verifyForgotPasswordOtp,
  getAllUsersController,
  updateUserStatusController,
  updateUserRoleController,
  deleteUserController,
  getUserStatsController,
  getRecentUsersController,
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
import { adminOnly } from "../middleware/authorize.js";
import upload from "../middleware/multer.js";

const userRouter = Router();

// Public routes
userRouter.post("/register", registerUserController);
userRouter.post("/verify-email", verifyEmailController);
userRouter.post("/login", loginController);
userRouter.post("/forgot-password", forgotPasswordController);
userRouter.post("/verify-forgot-password-otp", verifyForgotPasswordOtp);
userRouter.post("/reset-password", resetpassword);
userRouter.post("/refresh-token", refreshToken);

// Authenticated user routes
userRouter.post("/logout", auth, logoutController);
userRouter.post("/upload-avatar", auth, upload.single("avatar"), uploadAvatar);
userRouter.put("/update-user", auth, updateUserDetails);
userRouter.get("/user-details", auth, UserDetails);

// Admin only routes
userRouter.get("/all-users", auth, adminOnly, getAllUsersController);
userRouter.patch("/update-status", auth, adminOnly, updateUserStatusController);
userRouter.patch("/update-role", auth, adminOnly, updateUserRoleController);
userRouter.delete("/delete-user", auth, adminOnly, deleteUserController);
userRouter.get("/stats/overview", auth, adminOnly, getUserStatsController);
userRouter.get("/stats/recent", auth, adminOnly, getRecentUsersController);

export default userRouter;
