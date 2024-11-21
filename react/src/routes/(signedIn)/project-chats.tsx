import { MessageCircleIcon } from "lucide-react";

export default function ProjectChats() {
  return (
    <div className="flex-1 flex justify-center items-center">
      <div className="grid place-items-center place-content-center text-muted-foreground gap-2">
        <MessageCircleIcon className="size-12" />
        <span className="text-lg">Select chat</span>
      </div>
    </div>
  );
}
