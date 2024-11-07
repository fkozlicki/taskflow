import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
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

  const [taskList, setTaskList] = useState<Record<string, Task[]>>({
    todo: [],
    "in-progress": [],
    "in-review": [],
    done: [],
  });

  useEffect(() => {
    if (data) {
      setTaskList(data);
    }
  }, [data]);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const dragStartHandler = (e: DragStartEvent) => {
    const data = e.active.data.current?.task;

    if (data) {
      setActiveTask(data);
    }
  };

  const dragEndHandler = (e: DragEndEvent) => {
    // Check if item is drag into unknown area
    if (!e.over || !e.active.data.current || !e.over.data.current) return;

    // Check if item position is the same
    if (e.active.id === e.over.id) return;

    // Check if item is moved outside of the column
    if (
      e.active.data.current.sortable.containerId !==
      e.over.data.current.sortable.containerId
    )
      return;

    // Sort the items list order based on item target position
    const containerName = e.active.data.current.sortable.containerId;
    setTaskList((taskList) => {
      const temp = { ...taskList };
      if (!e.over) return temp;
      const oldIdx = temp[containerName].findIndex(
        (t) => t.id === e.active.id.toString(),
      );
      const newIdx = temp[containerName].findIndex(
        (t) => t.id === e.over?.id.toString(),
      );
      temp[containerName] = arrayMove(temp[containerName], oldIdx, newIdx);
      return temp;
    });
  };

  const dragOverHandler = (e: DragOverEvent) => {
    // Check if item is drag into unknown area
    if (!e.over) return;

    // Get the initial and target sortable list name
    const initialContainer = e.active.data.current?.sortable?.containerId;
    const targetContainer = e.over.data.current?.sortable?.containerId;

    // if there are none initial sortable list name, then item is not sortable item
    if (!initialContainer) return;

    // Order the item list based on target item position
    setTaskList((taskList) => {
      const temp = { ...taskList };

      // If there are no target container then item is moved into a droppable zone
      // droppable = whole area of the sortable list (works when the sortable list is empty)
      if (!targetContainer) {
        // If item is already there then don't re-added it
        if (taskList[e.over!.id].some((t) => t.id === e.active.id.toString()))
          return temp;

        // Remove item from it's initial container
        temp[initialContainer] = temp[initialContainer].filter(
          (task) => task.id !== e.active.id.toString(),
        );

        // Add item to it's target container which the droppable zone belongs to
        temp[e.over!.id].push(e.active.data.current?.task);

        return temp;
      }

      // If the item is drag around in the same container then just reorder the list
      if (initialContainer === targetContainer) {
        const oldIdx = temp[initialContainer].findIndex(
          (t) => t.id === e.active.id.toString(),
        );
        const newIdx = temp[initialContainer].findIndex(
          (t) => t.id === e.over!.id.toString(),
        );
        temp[initialContainer] = arrayMove(
          temp[initialContainer],
          oldIdx,
          newIdx,
        );
      } else {
        // If the item is drag into another different container

        // Remove item from it's initial container
        temp[initialContainer] = temp[initialContainer].filter(
          (task) => task.id !== e.active.id.toString(),
        );

        // Add item to it's target container
        const newIdx = temp[targetContainer].findIndex(
          (t) => t.id === e.over!.id.toString(),
        );
        temp[targetContainer].splice(newIdx, 0, e.active.data.current?.task);
      }

      return temp;
    });
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={dragEndHandler}
      onDragOver={dragOverHandler}
      onDragStart={dragStartHandler}
    >
      <div className="grid grid-cols-4 gap-4 items-start">
        {Object.entries(taskList).map(([col, tasks]) => (
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
        "border rounded-lg",
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
