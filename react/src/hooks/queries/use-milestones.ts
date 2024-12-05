import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api.ts";

export interface Milestone {
  id: string;
  content: string;
  done: boolean;
}

const getMilestones = async (projectId: string) => {
  return await api.get<Milestone[]>(`/projects/${projectId}/milestones`);
};

export function useMilestones(projectId: string) {
  return useQuery({
    queryKey: ["milestones", projectId],
    queryFn: () => getMilestones(projectId),
  });
}
