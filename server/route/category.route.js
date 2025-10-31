import { Router } from "express";
import auth from "../middleware/auth.js";
import { adminOnly } from "../middleware/authorize.js";
import {
  AddCategoryController,
  deleteCategoryController,
  getCategoryController,
  updateCategoryController,
} from "../controllers/category.controller.js";

const categoryRouter = Router();

// Public routes
categoryRouter.get("/get", getCategoryController);

// Admin routes
categoryRouter.post("/add-category", auth, adminOnly, AddCategoryController);
categoryRouter.put("/update", auth, adminOnly, updateCategoryController);
categoryRouter.delete("/delete", auth, adminOnly, deleteCategoryController);

export default categoryRouter;
