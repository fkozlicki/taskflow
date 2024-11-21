import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.ts";

interface EventPayload {
  projectId: string;
  title: string;
  description?: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  allDay: boolean;
}

const createEvent = async (payload: EventPayload) => {
  return (await axiosInstance.post("/events", payload)).data;
};

export function useCreateEvent() {
  return useMutation({
    mutationFn: createEvent,
  });
}
