import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { ProductProperty } from "../interfaces/Product";
import useAxiosPrivate from "./useAxiosPrivate";

interface useGetRecommendedProductsReturn {
  errorMsg: string;
  success: boolean;
  isLoading: boolean;
  getRecommendedProducts: () => Promise<ProductProperty[] | undefined>;
}

const useGetRecommendedProducts = (): useGetRecommendedProductsReturn => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();
  const getRecommendedProducts = async (): Promise<
    ProductProperty[] | undefined
  > => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.get("/product/recommendations");

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

      console.log(message);
      setErrorMsg(message);
      setSuccess(false);
      setIsLoading(false);
      toast.error(message);
      return undefined;
    }
  };

  return { errorMsg, success, isLoading, getRecommendedProducts };
};

export default useGetRecommendedProducts;
