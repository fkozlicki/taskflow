import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet.tsx";
import { Task } from "@/hooks/queries/use-project-tasks.ts";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { format, intervalToDuration } from "date-fns";
import TaskStatusBadge from "@/components/task-status-badge.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { UserIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress.tsx";

export default function TaskSheet({
  task,
  open,
  onOpenChange,
}: {
  task: Task;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const { days: totalDays } = intervalToDuration({
    start: task.createdAt,
    end: task.dueDate,
  });
  const { days: passedDays } = intervalToDuration({
    start: task.createdAt,
    end: new Date(),
  });

  const progress = ((passedDays ?? 0) / (totalDays ?? 0)) * 100;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl">
        <Tabs defaultValue="details">
          <TabsList className="h-8">
            <TabsTrigger value="details" className="text-xs">
              Details
            </TabsTrigger>
            <TabsTrigger value="edit" className="text-xs">
              Edit
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <SheetHeader className="space-y-0 mb-4">
              <div className="flex justify-between items-start">
                <SheetTitle>{task.name}</SheetTitle>
                <TaskStatusBadge status={task.status} />
              </div>
              <SheetDescription>{task.description}</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-muted-foreground">
                    Created
                  </span>
                  <span className="text-sm">
                    {format(task.createdAt, "do MMM")}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-medium text-muted-foreground">
                    Due
                  </span>
                  <span className="text-sm">
                    {format(task.dueDate, "do MMM")}
                  </span>
                </div>
              </div>
              <Progress value={progress} />
            </div>
            <div>
              <span className="text-sm font-medium inline-block mb-2">
                Users
              </span>
              <div className="flex gap-5">
                {task.users.map((user) => (
                  <div key={user.id} className="flex items-center gap-2">
                    <Avatar>
                      <AvatarFallback>
                        <UserIcon className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="edit">Change your password here.</TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
