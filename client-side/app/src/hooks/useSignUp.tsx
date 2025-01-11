import { useState } from "react";

import { AxiosError } from "axios";
import { axiosGlobal } from "../lib/axios";
import { useUser } from "../contexts/UserProvider";
import { UserProperty } from "../interfaces/User";
import { toast } from "react-hot-toast";

type SignupData = {
  name: string;
  email: string;
  password: string;
  confrimPassword: string;
};

interface useSignUpReturn {
  errorMsg: string;
  success: boolean;
  isLoading: boolean;
  signup: (data: SignupData) => Promise<UserProperty | undefined>;
}

const useSignUp = (): useSignUpReturn => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dispatch } = useUser();
  const signup = async ({
    name,
    password,
    email,
  }: SignupData): Promise<UserProperty | undefined> => {
    try {
      setIsLoading(true);
      const response = await axiosGlobal.post("/auth/signup", {
        name,
        password,
        email,
      });

      const data = await response.data;
      setIsLoading(false);
      setSuccess(true);
      setErrorMsg("");
      dispatch({ type: "SET_USER", payload: { ...data?.user } });
      toast.success("You have account now!");
      return data?.user;
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data.message
          : "Something went Wrong";

      setErrorMsg(message);
      setSuccess(false);
      setIsLoading(false);
      toast.error(message);
      return undefined;
    }
  };
  return { errorMsg, success, isLoading, signup };
};

export default useSignUp;
