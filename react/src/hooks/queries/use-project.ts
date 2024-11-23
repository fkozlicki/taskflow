import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.ts";

export interface ProjectDetails {
  id: string;
  name: string;
  description?: string;
  isOwner: boolean;
  members: {
    id: string;
    name: string;
    email: string;
  }[];
  invitationCode: string;
}

async function getProject(id: string) {
  return (await axiosInstance.get<ProjectDetails>(`/projects/${id}`)).data;
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => getProject(id),
  });
}
