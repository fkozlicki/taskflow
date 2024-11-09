import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.ts";

interface CreateProjectPayload {
  name: string;
  description?: string;
}

const createProject = async (payload: CreateProjectPayload) => {
  return (await axiosInstance.post("/projects", payload)).data;
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
