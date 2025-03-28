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
import { differenceInDays } from "date-fns";
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

  const days = differenceInDays(task.dueDate, task.createdAt);

  const elapsedDays = differenceInDays(new Date(), new Date(task.createdAt));

  const progress = (elapsedDays / days) * 100;

  const actualProgress = progress > 100 ? 100 : progress;

  return (
    <>
      <TaskSheet task={task} open={open} onOpenChange={setOpen} />
      <Card
        className={cn(
          "select-none",
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
        <CardContent
          className="py-2 px-3 group cursor-pointer hover:bg-accent/50"
          onClick={() => setOpen(true)}
        >
          <CardTitle className="text-sm mb-2 group-hover:underline">
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
                <span className="text-xs">{actualProgress.toFixed(0)}%</span>
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
