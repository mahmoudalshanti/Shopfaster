import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { ProductProperty } from "../interfaces/Product";
import useAxiosPrivate from "./useAxiosPrivate";

interface useUpdateProductReturn {
  errorMsg: string;
  success: boolean;
  isLoading: boolean;
  updateProduct: (id: string) => Promise<ProductProperty[] | undefined>;
}

const useUpdateProduct = (): useUpdateProductReturn => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();
  const updateProduct = async (
    id: string
  ): Promise<ProductProperty[] | undefined> => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.patch(`/product/${id}`);

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

  return { errorMsg, success, isLoading, updateProduct };
};

export default useUpdateProduct;
