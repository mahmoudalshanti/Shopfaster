import { useState } from "react";
import { AxiosError } from "axios";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";

interface useRefreshTokenReturn {
  errorMsg: string;
  success: boolean;
  isLoading: boolean;
  refreshToken: () => Promise<string | undefined>;
}

const useRefreshToken = (): useRefreshTokenReturn => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshToken = async (): Promise<string | undefined> => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/auth/refresh-token`);

      const data = response.data;
      setIsLoading(false);
      setSuccess(true);
      setErrorMsg("");

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

  return { errorMsg, success, isLoading, refreshToken };
};

export default useRefreshToken;
