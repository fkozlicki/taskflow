import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api.ts";

export interface ProjectEvent {
  id: string;
  date: string;
  title: string;
  description: string | null;
  allDay: boolean;
  startTime: string | null;
  endTime: string | null;
}

const getProjectEvents = async (projectId: string) => {
  return await api.get<Record<string, ProjectEvent[]>>(
    `/projects/${projectId}/events`,
  );
};

export function useProjectEvents(projectId: string) {
  return useQuery({
    queryKey: ["project_events", projectId],
    queryFn: () => getProjectEvents(projectId),
  });
}
