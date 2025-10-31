import { Router } from "express";
import auth from "../middleware/auth.js";
import { adminOnly } from "../middleware/authorize.js";
import {
  getDashboardStatsController,
  getSalesAnalyticsController,
  getTopProductsController,
  getLowStockProductsController,
  getRevenueByCategoryController,
} from "../controllers/dashboard.controller.js";

const dashboardRouter = Router();

// All dashboard routes require admin authentication
dashboardRouter.get("/stats", auth, adminOnly, getDashboardStatsController);
dashboardRouter.get("/sales-analytics", auth, adminOnly, getSalesAnalyticsController);
dashboardRouter.get("/top-products", auth, adminOnly, getTopProductsController);
dashboardRouter.get("/low-stock", auth, adminOnly, getLowStockProductsController);
dashboardRouter.get("/revenue-by-category", auth, adminOnly, getRevenueByCategoryController);

export default dashboardRouter;
