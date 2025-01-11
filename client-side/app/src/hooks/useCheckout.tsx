import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { ProductProperty } from "../interfaces/Product";
import { CouponProperty } from "./useValidateCoupon";
import { loadStripe } from "@stripe/stripe-js";
import useAxiosPrivate from "./useAxiosPrivate";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_SECRET_KEY || "");

interface useCheckoutReturn {
  errorMsg: string;
  success: boolean;
  isLoading: boolean;
  checkout: (
    products: ProductProperty[],
    coupon: CouponProperty | null
  ) => Promise<{ id: string; totalAmount: number } | undefined>;
}

const useCheckout = (): useCheckoutReturn => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();

  const checkout = async (
    products: ProductProperty[],
    coupon: CouponProperty | null
  ): Promise<{ id: string; totalAmount: number } | undefined> => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.post(
        "/payment/create-checkout-session",
        {
          products,
          couponCode: coupon ? coupon.code : null,
        }
      );

      const data = response.data;
      setIsLoading(false);
      setSuccess(true);
      setErrorMsg("");

      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({
        sessionId: data.id,
      });
      return data;
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data.message
          : "Something went wrong";

      console.log(message);
      setErrorMsg(message);
      setSuccess(false);
      setIsLoading(false);
      toast.error(message);
      return undefined;
    }
  };

  return { errorMsg, success, isLoading, checkout };
};

export default useCheckout;
