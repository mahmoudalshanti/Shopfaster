import axios from "axios";

const axiosPrivate = axios.create({
  baseURL:
    import.meta.env.MODE === "development" ? "http://localhost:5000/" : "/api",
  withCredentials: true,
});

export const axiosGlobal = axios.create({
  baseURL:
    import.meta.env.MODE === "development" ? "http://localhost:5000/" : "/api",
  withCredentials: true,
});

export default axiosPrivate;
