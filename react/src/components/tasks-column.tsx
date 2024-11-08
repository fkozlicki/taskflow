import { useState } from "react";
import { Task } from "@/hooks/queries/use-project-tasks.ts";
import { useDroppable } from "@dnd-kit/core";
import { useParams } from "react-router-dom";
import CreateTaskSheet from "@/components/create-task-sheet.tsx";
import { Button } from "@/components/ui/button.tsx";
import { PlusIcon } from "lucide-react";
import { SortableContext } from "@dnd-kit/sortable";
import TaskCard from "@/components/task-card.tsx";
import { Column } from "@/lib/constants.ts";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";

export default function TasksColumn({
  col,
  tasks,
}: {
  col: Column;
  tasks: Task[];
}) {
  const { setNodeRef } = useDroppable({ id: col.id });

  const [sheetOpen, setSheetOpen] = useState(false);
  const params = useParams();

  const openSheet = () => {
    setSheetOpen(true);
  };

  return (
    <div className="border rounded-lg flex flex-col flex-1 max-h-full bg-slate-200/50">
      <CreateTaskSheet
        status={col.id}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        projectId={params.projectId!}
        position={tasks.length}
      />
      <div className="p-2 border-b flex items-center justify-between">
        <div className="flex items-center">
          <div
            className="w-1 mr-1.5 rounded-full h-[18px]"
            style={{ background: col.color }}
          ></div>
          <span className="text-sm font-medium">{col.label}</span>
          <div className="bg-gray-400 text-xs w-4 h-4 ml-1.5 rounded grid place-items-center text-gray-100 font-semibold">
            {tasks.length}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          onClick={openSheet}
        >
          <PlusIcon className="size-3.5" />
        </Button>
      </div>
      <SortableContext id={col.id} items={tasks}>
        <ScrollArea className="p-3 flex-1 flex flex-col overflow-auto">
          <div ref={setNodeRef} className="flex flex-col gap-2 min-h-32">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </ScrollArea>
      </SortableContext>
      <div className="p-2 border-t flex justify-center">
        <Button size="sm" className="h-7" variant="ghost" onClick={openSheet}>
          <PlusIcon className="size-3.5" />
          Add new
        </Button>
      </div>
    </div>
  );
}
