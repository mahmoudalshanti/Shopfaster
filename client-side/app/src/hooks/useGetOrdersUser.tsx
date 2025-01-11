import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import useAxiosPrivate from "./useAxiosPrivate";
import { OrderProperty } from "./useGetAllOrders";

interface useGetOrdersUserReturn {
  errorMsg: string;
  success: boolean;
  isLoading: boolean;
  getOrders: () => Promise<OrderProperty[] | undefined>;
}

const useGetOrdersUser = (): useGetOrdersUserReturn => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();

  const getOrders = async (): Promise<OrderProperty[] | undefined> => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.get(`/order/user`);

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

export default useGetOrdersUser;
