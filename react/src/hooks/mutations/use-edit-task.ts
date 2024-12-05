import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Task } from "@/hooks/queries/use-project-tasks.ts";
import { api } from "@/lib/api.ts";

interface EditTaskPayload {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  status: string;
  users: string[];
}

const editTask = async (payload: EditTaskPayload) => {
  const { id, ...data } = payload;
  return await api.patch(`/tasks/${id}`, data);
};

export function useEditTask() {
  const queryClient = useQueryClient();
  const params = useParams();
  const projectId = params.projectId!;

  return useMutation({
    mutationFn: editTask,
    async onMutate(newTask) {
      await queryClient.cancelQueries({
        queryKey: ["project_tasks", projectId],
      });

      const previousTasks = queryClient.getQueryData([
        "project_tasks",
        projectId,
      ]);

      queryClient.setQueryData(
        ["project_tasks", projectId],
        (old: Record<string, Task[]>) => {
          old[newTask.status] = old[newTask.status].map((task) =>
            task.id === newTask.id
              ? {
                  ...task,
                  name: newTask.name,
                  description: newTask.description,
                  dueDate: newTask.dueDate.toISOString(),
                }
              : task,
          );

          return old;
        },
      );

      return { previousTasks };
    },
    async onSettled() {
      await queryClient.invalidateQueries({
        queryKey: ["project_tasks", projectId],
      });
    },
  });
}
