import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import useDeleteCart from "./useDeleteCart";
import { useCart } from "../contexts/CartProvider";
import useAxiosPrivate from "./useAxiosPrivate";

interface useCheckoutSuccessReturn {
  errorMsg: string;
  success: boolean;
  isLoading: boolean;
  checkoutSuccess: (sessionId: string) => Promise<string | undefined>;
}

const useCheckoutSuccess = (): useCheckoutSuccessReturn => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { deleteCart } = useDeleteCart();
  const { dispatch } = useCart();
  const axiosPrivate = useAxiosPrivate();
  const checkoutSuccess = async (
    sessionId: string
  ): Promise<string | undefined> => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.post("/payment/checkout-success", {
        sessionId,
      });
      await deleteCart("");

      const data = response.data;
      setIsLoading(false);
      setSuccess(true);
      setErrorMsg("");

      dispatch({
        type: "CLEAN_CART",
        paylaod2: [],
        payload: {
          _id: "",
          category: "",
          description: "",
          image: "",
          isFeatured: false,
          name: "",
          price: 0,
          quantity: 0,
        },
      });
      console.log(data, "DATA");
      return data.track;
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

  return { errorMsg, success, isLoading, checkoutSuccess };
};

export default useCheckoutSuccess;
