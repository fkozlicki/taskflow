import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api.ts";

interface EditProjectPayload {
  name: string;
  description?: string;
  id: string;
}

const editProject = async (payload: EditProjectPayload) => {
  const { id, ...data } = payload;

  return await api.patch(`/projects/${id}`, data);
};

export function useEditProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editProject,
    onSuccess(_, payload) {
      void queryClient.invalidateQueries({ queryKey: ["projects"] });
      void queryClient.invalidateQueries({ queryKey: ["project", payload.id] });
    },
  });
}
