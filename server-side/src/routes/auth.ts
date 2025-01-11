import express from "express";
import {
  login,
  logout,
  refreshToken,
  signup,
  getProfile,
} from "../controllers/authController";
import { portectRoute } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", signup as any);
router.get("/logout", logout as any);
router.post("/login", login as any);
router.get("/refresh-token", refreshToken as any);
router.get("/profile", portectRoute as any, getProfile as any);

export default router;
