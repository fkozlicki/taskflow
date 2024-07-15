import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
})

export const get = async (endpoint: string) => {
    try {
        const response = await api.get(endpoint)
        return response.data;
    } catch (error) {
        console.error(error)
    }
}

export const post = async (endpoint: string, values: any) => {
    const response = await api.post(endpoint, values)
    return response.data;
}