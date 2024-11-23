import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.ts";
import { Milestone } from "@/hooks/queries/use-milestones.ts";

interface CreateMilestonePayload {
  projectId: string;
  content: string;
}

const createMilestone = async (payload: CreateMilestonePayload) => {
  return (await axiosInstance.post(`/milestones`, payload)).data;
};

export function useCreateMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMilestone,
    onMutate: async (data) => {
      const projectId = data.projectId;

      await queryClient.cancelQueries({
        queryKey: ["milestones", projectId],
      });

      const previousMilestones = queryClient.getQueryData([
        "milestones",
        projectId,
      ]);

      queryClient.setQueryData(
        ["milestones", projectId],
        (old: Milestone[]) => [
          ...old,
          {
            id: crypto.randomUUID(),
            done: false,
            content: data.content,
          },
        ],
      );

      return { previousMilestones };
    },
    onSettled(_a, _b, data) {
      void queryClient.invalidateQueries({
        queryKey: ["milestones", data.projectId],
      });
    },
  });
}
