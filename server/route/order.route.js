import { Router } from "express";
import auth from "../middleware/auth.js";
import { adminOnly } from "../middleware/authorize.js";
import {
  createOrderController,
  getAllOrdersController,
  getUserOrdersController,
  getOrderDetailsController,
  updateOrderStatusController,
  deleteOrderController,
  getOrderStatsController,
  getRecentOrdersController,
} from "../controllers/order.controller.js";

const orderRouter = Router();

// User routes (authenticated)
orderRouter.post("/create", auth, createOrderController);
orderRouter.get("/my-orders", auth, getUserOrdersController);
orderRouter.get("/:orderId", auth, getOrderDetailsController);

// Admin routes
orderRouter.get("/", auth, adminOnly, getAllOrdersController);
orderRouter.patch("/update-status", auth, adminOnly, updateOrderStatusController);
orderRouter.delete("/delete", auth, adminOnly, deleteOrderController);
orderRouter.get("/stats/overview", auth, adminOnly, getOrderStatsController);
orderRouter.get("/stats/recent", auth, adminOnly, getRecentOrdersController);

export default orderRouter;
