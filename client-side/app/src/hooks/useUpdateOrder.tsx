import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import useAxiosPrivate from "./useAxiosPrivate";

interface useUpdateOrdersReturn {
  errorMsg: string;
  success: boolean;
  isLoading: boolean;
  updateOrders: (status: string, id: string) => Promise<string | undefined>;
}

const useUpdateAllOrders = (): useUpdateOrdersReturn => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();

  const updateOrders = async (
    status: string,
    id: string
  ): Promise<string | undefined> => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.put(`/order`, {
        id,
        status,
      });

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

  return { errorMsg, success, isLoading, updateOrders };
};

export default useUpdateAllOrders;
