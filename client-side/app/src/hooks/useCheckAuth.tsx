import { useState } from "react";
import { AxiosError } from "axios";
import { axiosGlobal } from "../lib/axios";
import { toast } from "react-hot-toast";
import { UserProperty } from "../interfaces/User";
import { useUser } from "../contexts/UserProvider";

interface usecheckAuthReturn {
  errorMsg: string;
  success: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<UserProperty | undefined>;
}

const useCheckAuth = (): usecheckAuthReturn => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dispatch, user } = useUser();
  const checkAuth = async (): Promise<UserProperty | undefined> => {
    try {
      setIsLoading(true);
      const response = await axiosGlobal.get(`/auth/profile`);

      const data = response.data;
      setIsLoading(false);
      setSuccess(true);
      setErrorMsg("");
      dispatch({ type: "SET_USER", payload: data.user });
      return data.user;
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data.message
          : "Something went wrong";

      console.log(message);
      setErrorMsg(message);
      setSuccess(false);
      setIsLoading(false);
      if (user.name) toast.error(message || "Something went wrong");
      return undefined;
    }
  };

  return { errorMsg, success, isLoading, checkAuth };
};

export default useCheckAuth;
