import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { useProducts } from "../contexts/ProductsProvider";
import { ProductProperty } from "../interfaces/Product";
import useAxiosPrivate from "./useAxiosPrivate";

export interface ProductData {
  name: string;
  description: string;
  price: number | undefined;
  category:
    | "shoes"
    | "t-shirts"
    | "jeans"
    | "suits"
    | "glasses"
    | "bags"
    | "jackets";
  count: string;
  image: string;
}

interface useCreateProductReturn {
  errorMsg: string;
  success: boolean;
  isLoading: boolean;
  createProduct: (formData: FormData) => Promise<ProductProperty[] | undefined>;
}

const useCreateProducts = (): useCreateProductReturn => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dispatch } = useProducts();
  const axiosPrivate = useAxiosPrivate();
  const createProduct = async (
    formData: FormData
  ): Promise<ProductProperty[] | undefined> => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.post("/product", formData);

      const data = response.data;
      setIsLoading(false);
      setSuccess(true);
      setErrorMsg("");
      dispatch({
        type: "CREATE_PRODUCT",
        payload: data.product,
        paylaod2: [],
      });

      toast.success("Create product success");
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

  return { errorMsg, success, isLoading, createProduct };
};

export default useCreateProducts;
