import { Response, Request } from "express";
import Coupon from "../models/Coupon";

interface Coupon {
  getCoupon: (request: Request, response: Response) => Promise<Response>;
  validateCoupon: (
    request: Request<{}, {}, { code: string }>,
    response: Response
  ) => Promise<Response>;
}
export const getCoupon: Coupon["getCoupon"] = async (
  requset: Request,
  response: Response
): Promise<Response> => {
  try {
    const coupon = await Coupon.findOne({
      userId: requset.user?._id,
      isActive: true,
    });
    return response.status(200).json({ coupon: coupon || null });
  } catch (err) {
    const message: string =
      err instanceof Error ? err.message : "Something went wrong";
    return response.status(500).json({ message });
  }
};

export const validateCoupon: Coupon["validateCoupon"] = async (
  requset: Request<{}, {}, { code: string }>,
  response: Response
): Promise<Response> => {
  try {
    const { code } = requset.body;
    console.log(code);
    const coupon = await Coupon.findOne({
      code: code,
      userId: requset.user?._id,
      isActive: true,
    });
    console.log(coupon);
    if (!coupon) {
      return response.status(404).json({ message: "Coupon not found" });
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return response.status(404).json({ message: "Coupon expired" });
    }

    return response.status(200).json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (err) {
    const message: string =
      err instanceof Error ? err.message : "Something went wrong";
    return response.status(500).json({ message });
  }
};
