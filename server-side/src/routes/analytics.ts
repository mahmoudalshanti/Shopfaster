import express, { Request, Response } from "express";
import {
  getAnalyticsData,
  getDailySalesData,
} from "../controllers/analyticsController";
import { adminRoute, portectRoute } from "../middleware/authMiddleware";

const router = express.Router();

router.get(
  "/",
  portectRoute as any,
  adminRoute as any,
  async (request: Request, response: Response) => {
    try {
      const analyticsData = await getAnalyticsData();

      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

      const dailySalesData = await getDailySalesData(startDate, endDate);

      response.json({
        analyticsData,
        dailySalesData,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      response.status(500).json({ message });
    }
  }
);

export default router;
