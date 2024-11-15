import { Task } from "@/hooks/queries/use-project-tasks.ts";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils.ts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Clock3Icon,
  LoaderCircleIcon,
  MessageCircleIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { intervalToDuration } from "date-fns";
import { useState } from "react";
import TaskSheet from "@/components/task-sheet.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";

export default function TaskCard({
  task,
  isOverlay,
}: {
  task: Task;
  isOverlay?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const [open, setOpen] = useState<boolean>(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { days } = intervalToDuration({
    start: task.createdAt,
    end: task.dueDate,
  });

  return (
    <>
      <TaskSheet task={task} open={open} onOpenChange={setOpen} />
      <Card
        className={cn(
          "select-none",
          isOverlay && "",
          isDragging && "opacity-40",
          isOverlay && "ring-2",
        )}
        ref={setNodeRef}
        style={style}
      >
        <CardHeader
          className={cn(
            "py-2 px-3 border-b cursor-grab",
            isOverlay && "cursor-grabbing",
          )}
          {...attributes}
          {...listeners}
        >
          <span className="text-xs">Owner: {}</span>
        </CardHeader>
        <CardContent className="py-2 px-3">
          <CardTitle
            onClick={() => setOpen(true)}
            className="text-sm mb-2 hover:underline cursor-pointer"
          >
            {task.name}
          </CardTitle>
          <div className="flex gap-2 items-center mb-6">
            <UsersIcon className="size-4" />
            <div className="flex gap-2">
              {task.users.map((user) => (
                <div
                  key={user.id}
                  className="bg-muted p-1 px-2 flex items-center gap-1 rounded-full"
                >
                  <Avatar className="size-4">
                    <AvatarFallback>
                      <UserIcon className="size-3" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium">{user.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <div className="flex items-center">
                <MessageCircleIcon className="size-3.5 mr-1" />
                <span className="text-xs">2</span>
              </div>
              <div className="flex items-center">
                <LoaderCircleIcon className="size-3.5 mr-1 -rotate-90" />
                <span className="text-xs">75%</span>
              </div>
            </div>

            <div className="flex items-center">
              <Clock3Icon className="size-3.5 mr-1" />
              <span className="text-xs">{days && `${days}d`}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
