import { useEffect, useState } from "react";
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
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { columns } from "@/lib/constants.ts";
import { arrayInsert, arrayRemove } from "@/lib/utils.ts";
import {
  arrayMove,
  SortableData,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Task, useProjectTasks } from "@/hooks/queries/use-project-tasks.ts";
import { useParams } from "react-router-dom";
import TasksColumn from "@/components/tasks-column.tsx";
import TaskCard from "@/components/task-card.tsx";
import { useReorderTask } from "@/hooks/mutations/use-reorder-task.ts";

export default function TasksBoard() {
  const sensors = useSensors(
    useSensor(TouchSensor),
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const { projectId } = useParams();

  const { mutate } = useReorderTask();

  const { data } = useProjectTasks(projectId!);

  const [tasks, setTasks] = useState<Record<string, Task[]>>({
    todo: [],
    "in-progress": [],
    "in-review": [],
    done: [],
  });

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const getFromData = (active: Active) => {
    const activeData = active.data.current as SortableData;
    const containerId = activeData.sortable.containerId as string;
    const items = tasks[containerId];

    return {
      id: active.id,
      containerId,
      items,
      index: activeData.sortable.index,
    };
  };

  const getToData = (over: Over) => {
    const overData = over.data.current as SortableData | undefined;
    const containerId = (overData?.sortable.containerId ?? over.id) as string;

    const items = tasks[containerId];

    return {
      id: over.id,
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

    if (from.id === to.id || from.containerId === to.containerId) {
      return;
    }

    const item = from.items[from.index];
    item.status = to.containerId;

    const newFromItems = arrayRemove(from.items, from.index);
    const newToItems = arrayInsert(to.items, to.index, item);

    setTasks((prev) => ({
      ...prev,
      [from.containerId]: newFromItems,
      [to.containerId]: newToItems,
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const data = getData(event);

    if (data == null) {
      return;
    }

    const { from, to } = data;

    const newFromItems = arrayMove(from.items, from.index, to.index);

    setTasks((prev) => ({
      ...prev,
      [from.containerId]: newFromItems,
    }));

    mutate({
      id: event.active.id as string,
      status: to.containerId,
      position: to.index,
      projectId: projectId!,
    });
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
    >
      <div className="flex gap-4 items-start h-full overflow-hidden">
        {columns.map((col) => (
          <TasksColumn key={col.id} col={col} tasks={tasks[col.id]} />
        ))}
      </div>

      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} isOverlay />}
      </DragOverlay>
    </DndContext>
  );
}
