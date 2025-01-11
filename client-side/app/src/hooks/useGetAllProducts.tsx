import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { useProducts } from "../contexts/ProductsProvider";
import { ProductProperty } from "../interfaces/Product";
import useAxiosPrivate from "./useAxiosPrivate";

interface useGetAllProductReturn {
  errorMsg: string;
  success: boolean;
  isLoading: boolean;
  getAllProducts: () => Promise<ProductProperty[] | undefined>;
}

const useGetAllProducts = (): useGetAllProductReturn => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dispatch } = useProducts();
  const axiosPrivate = useAxiosPrivate();

  const getAllProducts = async (): Promise<ProductProperty[] | undefined> => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.get("/product");

      const data = response.data;
      setIsLoading(false);
      setSuccess(true);
      setErrorMsg("");

      const { products } = data;

      dispatch({
        type: "SET_PRODUCT",
        payload: {
          _id: "",
          name: "",
          description: "",
          category: "",
          image: "",
          isFeatured: false,
          price: 0,
          quantity: 0,
        },
        paylaod2: products,
      });

      return products;
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

  return { errorMsg, success, isLoading, getAllProducts };
};

export default useGetAllProducts;
