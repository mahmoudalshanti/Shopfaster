import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { ProductProperty } from "../interfaces/Product";
import useAxiosPrivate from "./useAxiosPrivate";
import { UserProperty } from "../interfaces/User";

export interface OrderProperty {
  _id: string;
  user: UserProperty;
  track: string;
  status: string;
  totalAmount: number;
  products: ProductProperty[];
}
interface useGetOrdersReturn {
  errorMsg: string;
  success: boolean;
  isLoading: boolean;
  getOrders: () => Promise<OrderProperty[] | undefined>;
}

const useGetAllOrders = (): useGetOrdersReturn => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();

  const getOrders = async (): Promise<OrderProperty[] | undefined> => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.get(`/order`);

      const data = response.data;
      setIsLoading(false);
      setSuccess(true);
      setErrorMsg("");

      return data.orders;
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

  return { errorMsg, success, isLoading, getOrders };
};

export default useGetAllOrders;
