import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

const auth = async (request, response, next) => {
  try {
    const token =
      request.cookies.accessToken ||
      request?.headers?.authorization?.split(" ")[1];

    if (!token) {
      return response.status(401).json({
        message: "Authentication token required",
        error: true,
        success: false,
      });
    }

    const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

    if (!decode || !decode.id) {
      return response.status(401).json({
        message: "Invalid token payload",
        error: true,
        success: false,
      });
    }

    // Attach user ID to request
    request.userId = decode.id;

    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return response.status(401).json({
        message: "Token expired, please login again",
        error: true,
        success: false,
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({
        message: "Invalid token",
        error: true,
        success: false,
      });
    }

    // Log unexpected errors
    logger.error('Auth middleware error:', error);

    return response.status(401).json({
      message: "Authentication failed",
      error: true,
      success: false,
    });
  }
};

export default auth;
