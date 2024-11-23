import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.ts";

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
  return (
    await axiosInstance.get<Record<string, ProjectEvent[]>>(
      `/projects/${projectId}/events`,
    )
  ).data;
};

export function useProjectEvents(projectId: string) {
  return useQuery({
    queryKey: ["project_events", projectId],
    queryFn: () => getProjectEvents(projectId),
  });
}
