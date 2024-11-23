import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.ts";
import { Task } from "@/hooks/queries/use-project-tasks.ts";
import { useParams } from "react-router-dom";

interface TaskPayload {
  name: string;
  description: string;
  status: string;
  dueDate: Date;
  projectId: string;
  position: number;
}

async function createTask(task: TaskPayload) {
  return (await axiosInstance.post("/tasks", task)).data;
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const params = useParams();
  const projectId = params.projectId as string | undefined;

  return useMutation({
    mutationFn: createTask,
    async onMutate(newTask) {
      const projectId = newTask.projectId;

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
          old[newTask.status].push({
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            users: [],
            ...newTask,
            dueDate: newTask.dueDate.toISOString(),
          });

          return old;
        },
      );

      return { previousTasks };
    },
    onSettled() {
      void queryClient.invalidateQueries({
        queryKey: ["project_tasks", projectId],
      });
    },
  });
}
