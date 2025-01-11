import { useEffect } from "react";
import axiosPrivate from "../lib/axios";
import useRefreshToken from "./useRefreshToken";

const useAxiosPrivate = () => {
  const { refreshToken } = useRefreshToken();

  useEffect(() => {
    axiosPrivate.interceptors.response.use(
      (response: any) => response,
      async (err) => {
        const prevReq = err.config;
        if (err.response.status === 401) {
          await refreshToken();
          return axiosPrivate(prevReq);
        }

        return Promise.reject(err);
      }
    );
  }, []);

  return axiosPrivate;
};

export default useAxiosPrivate;
