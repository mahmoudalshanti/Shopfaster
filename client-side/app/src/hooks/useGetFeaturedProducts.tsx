import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { ProductProperty } from "../interfaces/Product";
import useAxiosPrivate from "./useAxiosPrivate";

interface useGetFeaturedProductReturn {
  errorMsg: string;
  success: boolean;
  isLoading: boolean;
  getFeaturedProduct: () => Promise<ProductProperty[] | undefined>;
}

const useGetFeaturedProducts = (): useGetFeaturedProductReturn => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();
  const getFeaturedProduct = async (): Promise<
    ProductProperty[] | undefined
  > => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.get("/product/featured");

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

  return { errorMsg, success, isLoading, getFeaturedProduct };
};

export default useGetFeaturedProducts;
