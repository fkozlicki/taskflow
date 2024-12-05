import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectEvent } from "@/hooks/queries/use-project-events.ts";
import { formatISO } from "date-fns";
import { api } from "@/lib/api.ts";

interface EventPayload {
  projectId: string;
  title: string;
  description?: string;
  date: Date;
  startTime?: Date;
  endTime?: Date;
  allDay: boolean;
}

const createEvent = async (payload: EventPayload) => {
  return await api.post("/events", payload);
};

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvent,
    onMutate(data) {
      queryClient.setQueryData(
        ["project_events", data.projectId],
        (old: Record<string, ProjectEvent[]>) => {
          const date = formatISO(data.date, { representation: "date" });
          const oldEvents = old[date] ?? [];
          oldEvents.push({
            ...data,
            id: crypto.randomUUID(),
            date: data.date.toISOString(),
            startTime: data.startTime?.toISOString() ?? null,
            endTime: data.endTime?.toISOString() ?? null,
            description: data.description ?? null,
          });

          return {
            ...old,
            [date]: oldEvents,
          };
        },
      );
    },
  });
}
