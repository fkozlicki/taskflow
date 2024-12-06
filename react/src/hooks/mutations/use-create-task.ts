import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "@/hooks/queries/use-project-tasks.ts";
import { useParams } from "react-router-dom";
import { api } from "@/lib/api.ts";
import { ProjectDetails } from "@/hooks/queries/use-project.ts";

interface TaskPayload {
  name: string;
  description: string;
  status: string;
  dueDate: Date;
  projectId: string;
  position: number;
  users: string[];
}

async function createTask(task: TaskPayload) {
  return await api.post("/tasks", task);
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

      const project = queryClient.getQueryData<ProjectDetails>([
        "project",
        projectId,
      ]);

      const members = (project?.members ?? []).filter((member) =>
        newTask.users.includes(member.id),
      );

      queryClient.setQueryData(
        ["project_tasks", projectId],
        (old: Record<string, Task[]>) => ({
          ...old,
          [newTask.status]: [
            ...(old[newTask.status] ?? []),
            {
              ...newTask,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              users: members,
              dueDate: newTask.dueDate.toISOString(),
            },
          ],
        }),
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
