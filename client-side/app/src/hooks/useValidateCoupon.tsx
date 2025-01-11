import { useState } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import useAxiosPrivate from "./useAxiosPrivate";

export interface CouponProperty {
  code: string;
  discountPercentage: number;
}
interface useValidateCouponReturn {
  errorMsg: string;
  success: boolean;
  isLoading: boolean;
  validateCoupon: (code: string) => Promise<CouponProperty | null>;
}

const useValidateCoupon = (): useValidateCouponReturn => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();
  const validateCoupon = async (
    code: string
  ): Promise<CouponProperty | null> => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.post("/coupon/validate", {
        code,
      });

      const data = response.data;
      setIsLoading(false);
      setSuccess(true);
      setErrorMsg("");
      toast.success("Validate code done");
      return data;
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data.message
          : "Something went wrong";

      setErrorMsg(message);
      setSuccess(false);
      setIsLoading(false);
      toast.error("Your code not avaliable");
      return null;
    }
  };

  return { errorMsg, success, isLoading, validateCoupon };
};

export default useValidateCoupon;
