import express from "express";
import { adminRoute, portectRoute } from "../middleware/authMiddleware";

import {
  getAllOrders,
  getAllOrdersByUser,
  updateOrder,
} from "../controllers/ordersController";

const router = express.Router();

router.get("/", portectRoute as any, adminRoute as any, getAllOrders as any);
router.put("/", portectRoute as any, adminRoute as any, updateOrder as any);
router.get("/user", portectRoute as any, getAllOrdersByUser as any);

export default router;
