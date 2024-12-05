import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api.ts";

interface CreateProjectPayload {
  name: string;
  description?: string;
}

const createProject = async (payload: CreateProjectPayload) => {
  return await api.post("/projects", payload);
};

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
