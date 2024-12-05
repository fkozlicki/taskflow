import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api.ts";

interface InvitePayload {
  projectId: string;
  email: string;
}

const invite = async (payload: InvitePayload) => {
  const { projectId, ...data } = payload;

  return await api.post(`/projects/${projectId}/invite`, data);
};

export function useInvite() {
  return useMutation({
    mutationFn: invite,
  });
}
