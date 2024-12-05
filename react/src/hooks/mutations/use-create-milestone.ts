import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Milestone } from "@/hooks/queries/use-milestones.ts";
import { api } from "@/lib/api.ts";

interface CreateMilestonePayload {
  projectId: string;
  content: string;
}

const createMilestone = async (payload: CreateMilestonePayload) => {
  return await api.post(`/milestones`, payload);
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
