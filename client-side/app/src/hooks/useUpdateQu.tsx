import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { ProductProperty } from "../interfaces/Product";
import useAxiosPrivate from "./useAxiosPrivate";

interface useUpdateQuReturn {
  errorMsg: string;
  success: boolean;
  isLoading: boolean;
  updateQu: (
    quantity: number,
    id: string
  ) => Promise<ProductProperty[] | undefined>;
}

const useUpdateQu = (): useUpdateQuReturn => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();
  const updateQu = async (
    quantity: number,
    id: string
  ): Promise<ProductProperty[] | undefined> => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.put(`/cart/${id}`, {
        quantity,
      });

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

  return { errorMsg, success, isLoading, updateQu };
};

export default useUpdateQu;
