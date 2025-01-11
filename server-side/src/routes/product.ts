import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getRecommendedProducts,
  toggleFeaturedProduct,
  getProduct,
} from "../controllers/productController";
import { adminRoute, portectRoute } from "../middleware/authMiddleware";

const router = express.Router();

import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

router.get("/", portectRoute as any, adminRoute as any, getAllProducts as any);
router.get("/featured", getFeaturedProducts as any);
router.post(
  "/",
  portectRoute as any,
  adminRoute as any,
  upload.single("image") as any,
  createProduct as any
);

router.get("/category/:category", getProductsByCategory as any);
router.get("/recommendations", getRecommendedProducts as any);
router.get("/:id", getProduct as any);
router.patch(
  "/:id",
  portectRoute as any,
  adminRoute as any,
  toggleFeaturedProduct as any
);
router.delete(
  "/:id",
  portectRoute as any,
  adminRoute as any,
  deleteProduct as any
);
export default router;
