import express from "express";
import { portectRoute } from "../middleware/authMiddleware";
import {
  createCheckoutSession,
  checkoutSuccess,
} from "../controllers/paymentController";

const router = express.Router();

router.post(
  "/create-checkout-session",
  portectRoute as any,
  createCheckoutSession as any
);
router.post("/checkout-success", portectRoute as any, checkoutSuccess as any);

export default router;
