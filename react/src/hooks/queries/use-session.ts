import {useQuery} from "@tanstack/react-query";
import {axiosInstance} from "@/lib/axios.ts";

interface User {
    id: string;
    name: string;
    email: string;
}

async function getSession() {
    return (await axiosInstance.get<User>('/users/session')).data
}

export function useSession() {
    return useQuery({
        queryKey: ['session'],
        queryFn: getSession
    })
}