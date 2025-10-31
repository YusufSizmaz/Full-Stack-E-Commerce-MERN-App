import { Router } from "express";
import auth from "../middleware/auth.js";
import { adminOnly } from "../middleware/authorize.js";
import {
  createProductController,
  getProductByCategory,
  getProductController,
  getProductDetailsController,
  updateProductController,
  deleteProductController,
  updateProductPublishController,
  searchProductController,
} from "../controllers/product.controller.js";

const productRouter = Router();

// Public routes
productRouter.get("/get", getProductController);
productRouter.get("/get-product-by-category", getProductByCategory);
productRouter.get("/search", searchProductController);
productRouter.get("/:productId", getProductDetailsController);

// Admin routes
productRouter.post("/create", auth, adminOnly, createProductController);
productRouter.put("/update", auth, adminOnly, updateProductController);
productRouter.delete("/delete", auth, adminOnly, deleteProductController);
productRouter.patch("/toggle-publish", auth, adminOnly, updateProductPublishController);

export default productRouter;
