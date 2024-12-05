import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 8000,
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
});
