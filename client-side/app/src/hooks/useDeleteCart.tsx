import { useState } from "react";
import { AxiosError } from "axios";

import { toast } from "react-hot-toast";
import { ProductProperty } from "../interfaces/Product";
import useAxiosPrivate from "./useAxiosPrivate";

interface useDeleteCartReturn {
  errorMsg: string;
  success: boolean;
  isLoading: boolean;
  deleteCart: (productId: string) => Promise<ProductProperty[] | undefined>;
}

const useDeleteCart = (): useDeleteCartReturn => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();
  const deleteCart = async (
    productId: string
  ): Promise<ProductProperty[] | undefined> => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.delete(
        `/cart/${productId ? productId : "null"}`
      );

      const data = response.data;
      setIsLoading(false);
      setSuccess(true);
      setErrorMsg("");

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

  return { errorMsg, success, isLoading, deleteCart };
};

export default useDeleteCart;