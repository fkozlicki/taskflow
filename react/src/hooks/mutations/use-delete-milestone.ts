import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api.ts";

const deleteMilestone = async (id: string) => {
  return await api.delete(`/milestones/${id}`);
};

export function useDeleteMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMilestone,
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: ["milestones"] });
    },
  });
}
