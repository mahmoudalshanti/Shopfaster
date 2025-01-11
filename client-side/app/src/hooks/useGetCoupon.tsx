import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import useAxiosPrivate from "./useAxiosPrivate";
import { CouponProperty } from "../interfaces/Coupon";

interface useGetCouponReturn {
  errorMsg: string;
  success: boolean;
  isLoading: boolean;
  getCoupon: () => Promise<CouponProperty | null>;
}

const useGetCoupon = (): useGetCouponReturn => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();

  const getCoupon = async (): Promise<CouponProperty | null> => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.get("/coupon");

      const data = response.data;
      setIsLoading(false);
      setSuccess(true);
      setErrorMsg("");

      return data.coupon;
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
      return null;
    }
  };

  return { errorMsg, success, isLoading, getCoupon };
};

export default useGetCoupon;
