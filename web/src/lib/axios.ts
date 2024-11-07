import axios, {AxiosRequestConfig} from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
})

export const get = async (endpoint: string, config?: AxiosRequestConfig<any>) => {
    const response = await api.get(endpoint, config)
    return response.data;
}

export const post = async (endpoint: string, values: any, config?: AxiosRequestConfig<any>) => {
    const response = await api.post(endpoint, values, config)
    return response.data;
}