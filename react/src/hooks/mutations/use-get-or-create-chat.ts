import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api.ts";

interface CreateChatPayload {
  userId: string;
  projectId: string;
}

const createChat = async (payload: CreateChatPayload) => {
  return await api.post<{ id: string }>("/chats", payload);
};

export function useGetOrCreateChat() {
  return useMutation({
    mutationFn: createChat,
  });
}
