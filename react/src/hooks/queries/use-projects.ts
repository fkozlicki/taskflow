import {useQuery} from "@tanstack/react-query";
import {axiosInstance} from "@/lib/axios.ts";

export interface Project {
    id: string;
    name: string;
}

async function getProjects() {
    return (await axiosInstance.get<Project[]>('/projects')).data
}

export function useProjects() {
    return useQuery({
        queryKey: ['projects'],
        queryFn: getProjects
    })
}