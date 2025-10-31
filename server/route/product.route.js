import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  createProductController,
  getProductByCategory,
  getProductController,
} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post("/create", auth, createProductController);
<<<<<<< HEAD
productRouter.post("/get", getProductController);
productRouter.post("/get-product-by-category", getProductByCategory);
=======
productRouter.get("/get", getProductController);
productRouter.get("/get-product-by-category", getProductByCategory);
>>>>>>> parent of dd884ad (feat: Complete admin panel backend implementation)

export default productRouter;
