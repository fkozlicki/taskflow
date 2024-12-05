import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api.ts";

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
  return await api.get<ProjectDetails>(`/projects/${id}`);
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => getProject(id),
  });
}
