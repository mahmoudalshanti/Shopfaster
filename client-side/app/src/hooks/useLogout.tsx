import { useState } from "react";

import { AxiosError } from "axios";
import { useUser } from "../contexts/UserProvider";

import { toast } from "react-hot-toast";
import useAxiosPrivate from "./useAxiosPrivate";

interface useLogoutReturn {
  errorMsg: string;
  success: boolean;
  isLoading: boolean;
  logout: () => Promise<string | undefined>;
}

const useLogout = (): useLogoutReturn => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dispatch } = useUser();
  const axiosPrivate = useAxiosPrivate();
  const logout = async (): Promise<string | undefined> => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.get("/auth/logout");

      const data = await response.data;
      setIsLoading(false);
      setSuccess(true);
      setErrorMsg("");
      dispatch({
        type: "SET_USER",
        payload: { _id: "", email: "", name: "", role: "" },
      });
      return data?.message;
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data.message
          : "Something went Wrong";

      console.log(message);
      setErrorMsg(message);
      setSuccess(false);
      setIsLoading(false);
      toast.error(message);
      return undefined;
    }
  };
  return { errorMsg, success, isLoading, logout };
};

export default useLogout;
