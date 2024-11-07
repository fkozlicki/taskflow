import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.ts";

interface TaskPayload {
  name: string;
  description: string;
  status: string;
  dueDate: Date;
  projectId: string;
}

async function createTask(task: TaskPayload) {
  return (await axiosInstance.post("/tasks", task)).data;
}

export function useCreateTask() {
  return useMutation({
    mutationFn: createTask,
  });
}
