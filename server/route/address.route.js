import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  getAddressesController,
  addAddressController,
  updateAddressController,
  deleteAddressController,
} from "../controllers/address.controller.js";

const addressRouter = Router();

addressRouter.get("/get", auth, getAddressesController);
addressRouter.post("/add", auth, addAddressController);
addressRouter.put("/update", auth, updateAddressController);
addressRouter.delete("/delete", auth, deleteAddressController);

export default addressRouter;

