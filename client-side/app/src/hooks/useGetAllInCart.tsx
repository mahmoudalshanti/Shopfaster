import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { ProductProperty } from "../interfaces/Product";
import { useCart } from "../contexts/CartProvider";
import useAxiosPrivate from "./useAxiosPrivate";

interface useGetAllInCartReturn {
  errorMsg: string;
  success: boolean;
  isLoading: boolean;
  getAllInCart: () => Promise<ProductProperty[] | undefined>;
}

const useGetAllInCart = (): useGetAllInCartReturn => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dispatch } = useCart();
  const axiosPrivate = useAxiosPrivate();

  const getAllInCart = async (): Promise<ProductProperty[] | undefined> => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.get(`/cart`);
      const data = response.data;
      setIsLoading(false);
      setSuccess(true);
      setErrorMsg("");

      dispatch({
        type: "SET_PRODUCT_CART",
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
        paylaod2: data.cartItems,
      });

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
      toast.error(message || "Something went wrong");
      return undefined;
    }
  };

  return { errorMsg, success, isLoading, getAllInCart };
};

export default useGetAllInCart;
