import {
  closestCenter,
  DndContext,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { PropsWithChildren, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";
import { Column } from "@/lib/constants.ts";
import { useNavigate } from "react-router-dom";

const columns = [
  { color: "#149eff", id: "todo", label: "To Do" },
  { color: "#15ff8e", id: "done", label: "Done" },
];

export default function Showcase() {
  const [isDragging, setIsDragging] = useState(false);
  const [parent, setParent] = useState("todo");
  const navigate = useNavigate();

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={({ over }) => {
        if (over) {
          if (over.id === "done") {
            navigate("/sign-in");
          }
          setParent(over.id.toString());
        }
        setIsDragging(false);
      }}
      onDragCancel={() => setIsDragging(false)}
    >
      <div className="flex gap-4">
        {columns.map((column) => (
          <TaskColumn key={column.id} column={column}>
            {parent === column.id && <Task dragging={isDragging} />}
          </TaskColumn>
        ))}
      </div>
    </DndContext>
  );
}

export function TaskColumn({
  column,
  children,
}: PropsWithChildren & { column: Column }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="border rounded-lg flex flex-col w-64 h-[200px] bg-slate-200/50 dark:bg-slate-950/65">
      <div className="p-2 border-b flex items-center justify-between">
        <div className="flex items-center">
          <div
            className="w-1 mr-1.5 rounded-full h-[18px]"
            style={{ background: column.color }}
          ></div>
          <span className="text-sm font-medium">{column.label}</span>
        </div>
      </div>
      <div ref={setNodeRef} className="p-2 flex-1">
        {children}
      </div>
    </div>
  );
}

export function Task({ dragging }: { dragging: boolean }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "task",
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <Card
      className={cn("select-none cursor-grab", dragging && "cursor-grabbing")}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-6">
        <CardTitle className="text-sm text-center">Join Taskflow</CardTitle>
      </CardContent>
    </Card>
  );
}
