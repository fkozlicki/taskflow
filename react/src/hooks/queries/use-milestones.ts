import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.ts";

export interface Milestone {
  id: string;
  content: string;
  done: boolean;
}

const getMilestones = async (projectId: string) => {
  return (
    await axiosInstance.get<Milestone[]>(`/projects/${projectId}/milestones`)
  ).data;
};

export function useMilestones(projectId: string) {
  return useQuery({
    queryKey: ["milestones", projectId],
    queryFn: () => getMilestones(projectId),
  });
}
