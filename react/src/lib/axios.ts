import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    timeout: 8000,
    headers: {
        Accept: "application/json",
    },
    withCredentials: true
})