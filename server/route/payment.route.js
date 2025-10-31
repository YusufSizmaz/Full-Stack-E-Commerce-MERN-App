import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  createPaymentIntentController,
  confirmPaymentController,
} from "../controllers/payment.controller.js";

const paymentRouter = Router();

paymentRouter.post("/create-intent", auth, createPaymentIntentController);
paymentRouter.post("/confirm", auth, confirmPaymentController);

export default paymentRouter;

