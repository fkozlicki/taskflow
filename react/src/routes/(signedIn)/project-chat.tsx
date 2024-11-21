import { Button } from "@/components/ui/button.tsx";
import { LoaderIcon, SendHorizonalIcon } from "lucide-react";
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
import { Fragment, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

const messageSchema = z.object({
  content: z.string().min(1),
});

type MessageValues = z.infer<typeof messageSchema>;

export default function ProjectChat() {
  const params = useParams();
  const chatId = params.chatId!;
  const { data, hasNextPage, fetchNextPage, isFetching } =
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
  const [inViewRef, inView] = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      void fetchNextPage();
    }
  }, [inView]);

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

  return (
    <div className="flex flex-col flex-1">
      <div className="p-4 border-b text-sm font-medium">Direct Message</div>
      <div className="flex-1  overflow-auto" onScroll={() => {}}>
        <div className="flex flex-col-reverse gap-4 py-2 min-h-full" ref={ref}>
          {data?.pages.map((group, index) => (
            <Fragment key={index}>
              {group.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "self-start px-4 bg-secondary h-8 flex items-center rounded-full",
                    message.sender.id === user?.id &&
                      "self-end bg-primary text-primary-foreground",
                  )}
                >
                  {message.content}
                </div>
              ))}
            </Fragment>
          ))}
          <div ref={inViewRef} className="flex justify-center">
            {isFetching && <LoaderIcon className="size-12 animate-spin" />}
            {!hasNextPage && (
              <div className="text-sm text-muted-foreground">
                No more messages
              </div>
            )}
          </div>
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
