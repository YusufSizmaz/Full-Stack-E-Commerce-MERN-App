import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  getCartController,
  addToCartController,
  updateCartItemController,
  removeFromCartController,
  clearCartController,
} from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.get("/get", auth, getCartController);
cartRouter.post("/add", auth, addToCartController);
cartRouter.put("/update", auth, updateCartItemController);
cartRouter.delete("/remove", auth, removeFromCartController);
cartRouter.delete("/clear", auth, clearCartController);

export default cartRouter;

