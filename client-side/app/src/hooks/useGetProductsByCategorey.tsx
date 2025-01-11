import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { ProductProperty } from "../interfaces/Product";
import useAxiosPrivate from "./useAxiosPrivate";

interface useGetProductsByCategoreyReturn {
  errorMsg: string;
  success: boolean;
  isLoading: boolean;
  getProductsByCategorey: (category: string) => Promise<ProductProperty[] | []>;
}

const useGetProductsByCategorey = (): useGetProductsByCategoreyReturn => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();

  const getProductsByCategorey = async (
    category: string
  ): Promise<ProductProperty[] | []> => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.get(`/product/category/${category}`);

      const data = response.data;
      setIsLoading(false);
      setSuccess(true);
      setErrorMsg("");

      return data.products;
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data.message
          : "Something went wrong";

      console.log(message, "SSSSSSSSSSS");
      setErrorMsg(message);
      setSuccess(false);
      setIsLoading(false);
      toast.error(message);

      return [];
    }
  };

  return { errorMsg, success, isLoading, getProductsByCategorey };
};

export default useGetProductsByCategorey;
