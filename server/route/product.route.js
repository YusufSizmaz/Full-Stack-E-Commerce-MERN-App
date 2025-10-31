import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  createProductController,
  getProductByCategory,
  getProductController,
} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post("/create", auth, createProductController);
productRouter.get("/get", getProductController);
productRouter.get("/get-product-by-category", getProductByCategory);

export default productRouter;
