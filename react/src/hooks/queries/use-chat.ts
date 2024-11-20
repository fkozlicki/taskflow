import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.ts";

export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
}

export interface PageMessages {
  nextCursor: string | null;
  messages: Message[];
}

const getMessages = async ({
  id,
  pageParam,
}: {
  id: string;
  pageParam: string;
}) => {
  return (
    await axiosInstance.get<PageMessages>(
      `/chats/${id}/messages?size=10&cursor=${pageParam}`,
    )
  ).data;
};

export function useChatMessages(id: string) {
  return useInfiniteQuery({
    queryKey: ["chat_messages", id],
    queryFn: ({ pageParam }) => getMessages({ id, pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: "",
  });
}
