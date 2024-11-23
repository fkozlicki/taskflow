import { Button } from "@/components/ui/button.tsx";
import { SendHorizonalIcon } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { useParams } from "react-router-dom";
import { PageMessages, useChatMessages } from "@/hooks/queries/use-chat.ts";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form.tsx";
import { useSession } from "@/hooks/queries/use-session.ts";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

const messageSchema = z.object({
  content: z.string().min(1),
});

type MessageValues = z.infer<typeof messageSchema>;

const reverseScroll = (e: WheelEvent) => {
  e.preventDefault();
  const t = e.currentTarget;
  if (t) {
    (t as HTMLDivElement).scrollTop -= e.deltaY;
  }
};

export default function ProjectChat() {
  const params = useParams();
  const chatId = params.chatId!;
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useChatMessages(chatId);
  const stompClient = useStompClient();
  const form = useForm<MessageValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });
  const { data: user } = useSession();
  const queryClient = useQueryClient();
  const ref = useRef<HTMLDivElement>(null);

  const allRows = data ? data.pages.flatMap((d) => d.messages) : [];

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
    initialOffset: 14,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= allRows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      void fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allRows.length,
    isFetchingNextPage,
    virtualItems,
  ]);

  useSubscription(`/topic/messages/${chatId}`, (message) => {
    queryClient.setQueryData<InfiniteData<PageMessages, unknown>>(
      ["chat_messages", chatId],
      (prev) => {
        if (!prev) {
          return {
            pages: [{ nextCursor: "", messages: [JSON.parse(message.body)] }],
            pageParams: [],
          };
        }

        return {
          pages: [
            {
              nextCursor: "",
              messages: [JSON.parse(message.body), ...prev.pages[0].messages],
            },
            ...prev.pages.slice(1),
          ],
          pageParams: [],
        };
      },
    );
    if (ref.current) {
      ref.current.scrollIntoView({ block: "end" });
    }
  });

  function onSubmit(values: MessageValues) {
    if (stompClient) {
      stompClient.publish({
        destination: `/app/sendMessage/${chatId}`,
        body: JSON.stringify({ content: values.content, senderId: user?.id }),
      });

      form.reset();
    }
  }

  useEffect(() => {
    const current = parentRef.current;

    current?.addEventListener("wheel", reverseScroll, { passive: false });
    return () => void current?.removeEventListener("wheel", reverseScroll);
  }, []);

  return (
    <div className="flex flex-col flex-1">
      <div className="p-4 border-b text-sm font-medium">Direct Message</div>
      <div className="flex-1 overflow-auto p-2 -scale-y-100" ref={parentRef}>
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
          className="w-full relative"
        >
          {virtualItems.map((item) => {
            const isLoaderRow = item.index > allRows.length - 1;
            const message = allRows[item.index];

            return (
              <div
                key={item.index}
                style={{
                  height: `${item.size}px`,
                  transform: `translateY(${item.start}px) scaleY(-1)`,
                }}
                className="top-0 left-0 w-full absolute flex items-center"
              >
                {isLoaderRow ? (
                  hasNextPage ? (
                    "Loading more..."
                  ) : (
                    "No more messages"
                  )
                ) : (
                  <div
                    className={cn(
                      "bg-secondary rounded-full px-4 flex items-center w-fit h-7 text-sm",
                      message?.sender.id === user?.id &&
                        "bg-primary text-primary-foreground",
                    )}
                  >
                    {message.content} - {item.index}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="border-t px-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-2 h-12"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <input
                      placeholder="Write your message..."
                      className="outline-none bg-transparent w-full"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button size="sm">
              <SendHorizonalIcon /> Send
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
