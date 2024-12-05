import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Milestone } from "@/hooks/queries/use-milestones.ts";
import { api } from "@/lib/api.ts";

interface EditMilestonePayload {
  id: string;
  done: boolean;
}

const editMilestone = async (payload: EditMilestonePayload) => {
  const { id, ...data } = payload;
  return await api.patch(`/milestones/${id}`, data);
};

export function useEditMilestone() {
  const queryClient = useQueryClient();
  const params = useParams();
  const projectId = params.projectId!;

  return useMutation({
    mutationFn: editMilestone,
    onMutate: (data) => {
      queryClient.setQueryData(
        ["milestones", projectId],
        (old: Milestone[]) => {
          return old.map((milestone) =>
            milestone.id === data.id
              ? {
                  ...milestone,
                  done: data.done,
                }
              : milestone,
          );
        },
      );
    },
    async onSettled() {
      await queryClient.invalidateQueries({
        queryKey: ["milestones", projectId],
      });
    },
  });
}
