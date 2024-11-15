import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios.ts';

export interface Task {
	id: string;
	name: string;
	description?: string;
	createdAt: string;
	dueDate: string;
	status: string;
	position: number;
	users: { id: string; name: string; email: string }[];
}

async function getProjectTasks(projectId: string) {
	return (
		await axiosInstance.get<Record<string, Task[]>>(
			`/projects/${projectId}/tasks`
		)
	).data;
}

export function useProjectTasks(projectId: string) {
	return useQuery({
		queryKey: ['project_tasks', projectId],
		queryFn: () => getProjectTasks(projectId),
	});
}
