import express from "express";
import { portectRoute } from "../middleware/authMiddleware";
import { getCoupon, validateCoupon } from "../controllers/couponController";

const router = express.Router();

router.get("/", portectRoute as any, getCoupon as any);
router.post("/validate", portectRoute as any, validateCoupon as any);

export default router;
