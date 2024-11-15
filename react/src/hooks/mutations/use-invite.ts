import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.ts";

interface InvitePayload {
  projectId: string;
  email: string;
}

const invite = async (payload: InvitePayload) => {
  const { projectId, ...data } = payload;

  return (await axiosInstance.post(`/projects/${projectId}/invite`, data)).data;
};

export function useInvite() {
  return useMutation({
    mutationFn: invite,
  });
}
