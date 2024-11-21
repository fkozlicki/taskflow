import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.ts";

interface CreateMilestonePayload {
  projectId: string;
  content: string;
}

const createMilestone = async (payload: CreateMilestonePayload) => {
  return (await axiosInstance.post(`/milestones`, payload)).data;
};

export function useCreateMilestone() {
  return useMutation({
    mutationFn: createMilestone,
  });
}
