import { axiosInstance } from "@/lib/axios.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "@/hooks/queries/use-project-tasks.ts";

interface ReorderPayload {
  id: string;
  position: number;
  status: string;
  projectId: string;
}

async function reorderTask(payload: ReorderPayload) {
  const { projectId, ...data } = payload;

  return (
    await axiosInstance.patch<Record<string, Task[]>>(
      `/projects/${projectId}/tasks/reorder`,
      data,
    )
  ).data;
}

export function useReorderTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderTask,
    onSuccess: (data, payload) => {
      queryClient.setQueryData(
        ["project_tasks", payload.projectId],
        () => data,
      );
    },
  });
}
