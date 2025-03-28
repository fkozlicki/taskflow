import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api.ts";

export interface Project {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  tasksCount: number;
  owner: { id: string; name: string; email: string };
}

async function getProjects() {
  return await api.get<Project[]>("/projects");
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
}
