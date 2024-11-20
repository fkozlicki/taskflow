import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.ts";

interface CreateChatPayload {
  userId: string;
  projectId: string;
}

const createChat = async (payload: CreateChatPayload) => {
  return (await axiosInstance.post<{ id: string }>("/chats", payload)).data;
};

export function useGetOrCreateChat() {
  return useMutation({
    mutationFn: createChat,
  });
}
