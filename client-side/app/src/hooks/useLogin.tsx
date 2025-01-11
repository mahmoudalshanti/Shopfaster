import { useState } from "react";

import { AxiosError } from "axios";
import { axiosGlobal } from "../lib/axios";
import { useUser } from "../contexts/UserProvider";
import { UserProperty } from "../interfaces/User";

import { toast } from "react-hot-toast";

type LoginData = {
  email: string;
  password: string;
};

interface useLoginReturn {
  errorMsg: string;
  success: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<UserProperty | undefined>;
}

const useLogin = (): useLoginReturn => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dispatch } = useUser();
  const login = async ({
    password,
    email,
  }: LoginData): Promise<UserProperty | undefined> => {
    try {
      setIsLoading(true);
      const response = await axiosGlobal.post("/auth/login", {
        password,
        email,
      });

      const data = await response.data;
      setIsLoading(false);
      setSuccess(true);
      setErrorMsg("");
      dispatch({ type: "SET_USER", payload: { ...data } });
      return data?.user;
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data.message
          : "Something went Wrong";

      console.log(message);
      setErrorMsg(message);
      setSuccess(false);
      setIsLoading(false);
      toast.error(message ? message : "Something went Wrong");
      return undefined;
    }
  };
  return { errorMsg, success, isLoading, login };
};

export default useLogin;
