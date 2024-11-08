import {
  Active,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  Over,
  PointerSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  SortableData,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { PlusIcon } from "lucide-react";
import CreateTaskSheet from "@/components/create-task-sheet.tsx";
import { useParams } from "react-router-dom";
import { Task, useProjectTasks } from "@/hooks/queries/use-project-tasks.ts";

// const columns = ["todo", "in-progress", "in-review", "done"];

export const arrayRemove = (array, index) => {
  return array.filter((_, i) => i !== index);
};

export const arrayInsert = (array, index, value) => {
  return [...array.slice(0, index), value, ...array.slice(index)];
};

export default function ProjectTasks() {
  const sensors = useSensors(
    useSensor(TouchSensor),
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const { projectId } = useParams();

  const { data } = useProjectTasks(projectId!);

  const [taskList, setTaskList] = useState<Map<string, Task[]>>(
    new Map(
      Object.entries({
        todo: [],
        "in-progress": [],
        "in-review": [],
        done: [],
      }),
    ),
  );

  useEffect(() => {
    if (data) {
      setTaskList(new Map(Object.entries(data)));
    }
  }, [data]);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const getFromData = (active: Active) => {
    const activeData = active.data.current as SortableData;
    const items = taskList.get(activeData.sortable.containerId as string)!;

    return {
      containerId: activeData.sortable.containerId as string,
      items,
      index: activeData.sortable.index,
    };
  };

  const getToData = (over: Over) => {
    const overData = over.data.current as SortableData | undefined;
    const containerId = (overData?.sortable.containerId ?? over.id) as string;

    const items = taskList.get(containerId)!;

    return {
      containerId,
      items,
      index: overData?.sortable.index ?? 0,
    };
  };

  const getData = (event: { active: Active; over: Over | null }) => {
    const { active, over } = event;
    if (over === null) {
      return null;
    }

    if (active.id === over.id) {
      return null;
    }

    return {
      from: getFromData(active),
      to: getToData(over),
    };
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(event.active.data.current?.task ?? null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const data = getData(event);
    if (data == null) {
      return;
    }

    const { from, to } = data;

    if (from.containerId === to.containerId) {
      return;
    }

    const item = from.items[from.index];

    const newFromItems = arrayRemove(from.items, from.index);
    const newToItems = arrayInsert(to.items, to.index, item);

    setTaskList(
      new Map([
        ...taskList.entries(),
        [from.containerId, newFromItems],
        [to.containerId, newToItems],
      ]),
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const data = getData(event);
    if (data == null) {
      return;
    }

    const { from, to } = data;

    const newFromItems = arrayMove(from.items, from.index, to.index);

    setTaskList(
      new Map([...taskList.entries(), [from.containerId, newFromItems]]),
    );
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
    >
      <div className="grid grid-cols-4 gap-4 items-start">
        {Array.from(taskList).map(([col, tasks]) => (
          <KanbanColumn key={col} col={col} tasks={tasks} />
        ))}
      </div>

      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} isOverlay />}
      </DragOverlay>
    </DndContext>
  );
}

function KanbanColumn({ col, tasks }: { col: string; tasks: Task[] }) {
  const { setNodeRef } = useDroppable({ id: col });

  const [sheetOpen, setSheetOpen] = useState(false);
  const params = useParams();

  const openSheet = () => {
    setSheetOpen(true);
  };

  const length = tasks.length;

  return (
    <div className="border rounded-lg">
      <CreateTaskSheet
        status={col}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        projectId={params.projectId!}
        position={length}
      />
      <div className="p-2 border-b flex items-center justify-between">
        <div>{col}</div>
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          onClick={openSheet}
        >
          <PlusIcon className="size-3.5" />
        </Button>
      </div>
      <SortableContext id={col} items={tasks}>
        <div ref={setNodeRef} className="p-3 flex flex-col gap-2 min-h-32">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
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

function TaskCard({ task, isOverlay }: { task: Task; isOverlay?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={cn(
        "border rounded-lg select-none",
        isOverlay && "",
        isDragging && "opacity-40",
        isOverlay && "ring-2",
      )}
      ref={setNodeRef}
      style={style}
    >
      <div
        className={cn(
          "p-2 border-b cursor-grab",
          isOverlay && "cursor-grabbing",
        )}
        {...attributes}
        {...listeners}
      >
        {task.name}
      </div>
      <div className="p-2">{task.description}</div>
    </div>
  );
}
