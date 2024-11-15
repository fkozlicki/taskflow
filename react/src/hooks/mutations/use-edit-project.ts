import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.ts";

interface EditProjectPayload {
  name: string;
  description?: string;
  id: string;
}

const createProject = async (payload: EditProjectPayload) => {
  const { id, ...data } = payload;

  return (await axiosInstance.put(`/projects/${id}`, data)).data;
};

export function useEditProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess(_, payload) {
      void queryClient.invalidateQueries({ queryKey: ["projects"] });
      void queryClient.invalidateQueries({ queryKey: ["project", payload.id] });
    },
  });
}
