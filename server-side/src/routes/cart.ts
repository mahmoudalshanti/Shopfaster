import express from "express";
import { portectRoute } from "../middleware/authMiddleware";
import {
  addToCart,
  getCartProducts,
  removeAllFromCart,
  updateQuantity,
} from "../controllers/cartController";

const router = express.Router();

router.get("/", portectRoute as any, getCartProducts as any);
router.post("/", portectRoute as any, addToCart as any);
router.delete("/:productId", portectRoute as any, removeAllFromCart as any);
router.put("/:id", portectRoute as any, updateQuantity as any);

export default router;
