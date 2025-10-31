import { Router } from "express";
import auth from "../middleware/auth.js";
import { getOrdersController } from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.get("/get", auth, getOrdersController);

export default orderRouter;

