import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  AddSubCategoryController,
  deleteSubCategoryController,
  getSubCategoryController,
  updateSubCategoryController,
} from "../controllers/subCategory.controller.js";

const subCategoryRouter = Router();

subCategoryRouter.post("/create", auth, AddSubCategoryController);
<<<<<<< HEAD
<<<<<<< HEAD
subCategoryRouter.post("/get", getSubCategoryController);
=======
subCategoryRouter.get("/get", getSubCategoryController);
>>>>>>> parent of dd884ad (feat: Complete admin panel backend implementation)
=======
subCategoryRouter.post("/get", getSubCategoryController);
>>>>>>> parent of b92fd77 (feat: Comprehensive backend improvements for production readiness)
subCategoryRouter.put("/update", auth, updateSubCategoryController);
subCategoryRouter.delete("/delete", auth, deleteSubCategoryController);

export default subCategoryRouter;
