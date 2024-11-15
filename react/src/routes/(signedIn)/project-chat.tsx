import { Button } from "@/components/ui/button.tsx";
import { SendHorizonalIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { cn } from "@/lib/utils.ts";

export default function ProjectChat() {
  return (
    <div className="h-full flex flex-col">
      <span className="text-3xl font-semibold inline-block mb-6">Chat</span>
      <div className="bg-background border rounded-lg flex flex-1 max-h-full overflow-hidden">
        <div className="min-w-[250px] border-r">chats</div>
        <div className="flex flex-col flex-1">
          <div className="p-4 border-b">Chat header</div>
          <ScrollArea className="flex-1 px-4 flex flex-col overflow-auto">
            <div className="flex flex-col gap-1 py-2">
              {Array.from({ length: 30 }).map((_, index) => (
                <div
                  className={cn(
                    "self-start px-4 bg-secondary h-8 flex items-center rounded-full",
                    index % 5 === 0 &&
                      "self-end bg-primary text-primary-foreground",
                  )}
                >
                  {index}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="h-12 gap-2 border-t flex items-center px-2">
            <input
              placeholder="Write your message..."
              className="w-full outline-none bg-transparent"
            />
            <Button size="sm">
              <SendHorizonalIcon /> Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
