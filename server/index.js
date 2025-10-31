import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectDB.js";
import userRouter from "./route/user.route.js";
import categoryRouter from "./route/category.route.js";
import uploadRouter from "./route/upload.router.js";
import subCategoryRouter from "./route/subCategory.route.js";
import productRouter from "./route/product.route.js";
<<<<<<< HEAD
<<<<<<< HEAD
=======
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
>>>>>>> parent of dd884ad (feat: Complete admin panel backend implementation)
=======
>>>>>>> parent of b92fd77 (feat: Comprehensive backend improvements for production readiness)

const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

const PORT = 8080 || process.env.PORT;

app.get("/", (request, response) => {
  /// Server to client
  response.json({
    massage: "Server çalışıyor." + PORT,
  });
});

app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/file", uploadRouter);
app.use("/api/subcategory", subCategoryRouter);
app.use("/api/product", productRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server ${PORT} Portunda çalışıyor 💀.`);
  });
});
