import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDB from "./config/connectDB.js";
import logger from "./config/logger.js";
import { validateEnv } from "./config/validateEnv.js";
import userRouter from "./route/user.route.js";
import categoryRouter from "./route/category.route.js";
import uploadRouter from "./route/upload.router.js";
import subCategoryRouter from "./route/subCategory.route.js";
import productRouter from "./route/product.route.js";
import orderRouter from "./route/order.route.js";
import dashboardRouter from "./route/dashboard.route.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/errorHandler.js";
import {
  apiRateLimiter,
  authRateLimiter,
  uploadRateLimiter,
  sanitizeData,
  securityHeaders,
  compressResponses,
  sanitizeInput,
} from "./middleware/security.js";
import { handleMulterError } from "./middleware/multer.js";

// Validate environment variables before starting the server
try {
  validateEnv();
} catch (error) {
  logger.error("Environment validation failed:", error);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 8080;

// Trust proxy for rate limiting behind reverse proxies (nginx, etc.)
app.set("trust proxy", 1);

// Security middleware
app.use(securityHeaders);
app.use(compressResponses);

// CORS configuration
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Request parsing with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Input sanitization
app.use(sanitizeData); // NoSQL injection prevention
app.use(sanitizeInput); // XSS prevention

// Request logging
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

// Health check endpoint (no rate limiting)
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "E-Commerce API Server",
    version: "1.0.0",
    port: PORT,
  });
});

// Apply rate limiting to API routes
app.use("/api", apiRateLimiter);

// API Routes with specific rate limiters
app.use("/api/user/login", authRateLimiter);
app.use("/api/user/register", authRateLimiter);
app.use("/api/user/forgot-password", authRateLimiter);
app.use("/api/file", uploadRateLimiter);

// Main API routes
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/file", uploadRouter);
app.use("/api/subcategory", subCategoryRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/dashboard", dashboardRouter);

// Multer error handler (must come before general error handler)
app.use(handleMulterError);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Database connection and server startup
let server;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    logger.info("Database connected successfully");

    // Start server
    server = app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      logger.error("Unhandled Promise Rejection:", err);
      // Close server & exit process
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      logger.error("Uncaught Exception:", err);
      // Close server & exit process
      server.close(() => {
        process.exit(1);
      });
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      logger.info("SIGTERM signal received: closing HTTP server");
      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      logger.info("SIGINT signal received: closing HTTP server");
      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
