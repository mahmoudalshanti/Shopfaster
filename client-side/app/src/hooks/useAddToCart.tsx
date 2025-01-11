import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { ProductProperty } from "../interfaces/Product";
import { useCart } from "../contexts/CartProvider";
import useAxiosPrivate from "./useAxiosPrivate";

interface useAddToCartReturn {
  errorMsg: string;
  success: boolean;
  isLoading: boolean;
  addToCart: (
    product: ProductProperty
  ) => Promise<ProductProperty[] | undefined>;
}

const useAddToCart = (): useAddToCartReturn => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dispatch } = useCart();
  const axiosPrivate = useAxiosPrivate();

  const addToCart = async (
    product: ProductProperty
  ): Promise<ProductProperty[] | undefined> => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.post("/cart", {
        productId: product._id,
      });

      const data = response.data;
      console.log(product, "product");
      setIsLoading(false);
      setSuccess(true);
      setErrorMsg("");

      dispatch({
        type: "ADD_TO_CART",
        payload: product,
        paylaod2: [],
      });
      toast.success("Product add to cart successfully");

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

  return { errorMsg, success, isLoading, addToCart };
};

export default useAddToCart;
