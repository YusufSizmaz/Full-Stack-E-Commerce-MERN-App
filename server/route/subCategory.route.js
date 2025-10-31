import { Router } from "express";
import auth from "../middleware/auth.js";
import { adminOnly } from "../middleware/authorize.js";
import {
  AddSubCategoryController,
  deleteSubCategoryController,
  getSubCategoryController,
  updateSubCategoryController,
} from "../controllers/subCategory.controller.js";

const subCategoryRouter = Router();

// Public routes
subCategoryRouter.get("/get", getSubCategoryController);

// Admin routes
subCategoryRouter.post("/create", auth, adminOnly, AddSubCategoryController);
subCategoryRouter.put("/update", auth, adminOnly, updateSubCategoryController);
subCategoryRouter.delete("/delete", auth, adminOnly, deleteSubCategoryController);

export default subCategoryRouter;
