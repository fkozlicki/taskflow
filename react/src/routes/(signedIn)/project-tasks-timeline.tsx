import { useProjectTasks } from "@/hooks/queries/use-project-tasks";
import { cn } from "@/lib/utils";
import {
  addDays,
  areIntervalsOverlapping,
  eachDayOfInterval,
  endOfDay,
  format,
  isSameDay,
  isWithinInterval,
  parseISO,
  startOfDay,
} from "date-fns";
import { useParams } from "react-router-dom";
import TaskStatusBadge from "@/components/task-status-badge.tsx";

export default function ProjectTasksTimeline() {
  const params = useParams();
  const { data } = useProjectTasks(params.projectId!);
  const tasks = data ? Object.values(data).flat() : [];

  const start = startOfDay(new Date());
  const end = addDays(start, 13);
  const days = eachDayOfInterval({
    start,
    end,
  });

  const tasksInInterval = tasks.filter((task) =>
    areIntervalsOverlapping(
      { start: task.createdAt, end: task.dueDate },
      { start: start, end: end },
    ),
  );

  return (
    <div className="bg-border rounded-lg border border-border overflow-hidden">
      <div className="flex gap-px border-b border-border">
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className="flex-1 text-center bg-background grid text-sm"
          >
            <span>{format(day, "do")}</span>
            <span>{format(day, "MMM")}</span>
          </div>
        ))}
      </div>
      <div
        className="grid relative h-[500px]"
        style={{
          gridTemplateColumns: `repeat(${days.length}, 1fr)`,
          gap: "1px",
        }}
      >
        {/* Background grid lines */}
        {days.map((_, index) => (
          <div key={`grid-${index}`} className="bg-background h-full" />
        ))}

        {/* Tasks Container */}
        <div className="absolute inset-0">
          <div
            className="grid h-full"
            style={{ gridTemplateRows: "repeat(auto-fill, 3rem)" }}
          >
            {tasksInInterval.map((task) => {
              const createdAt = startOfDay(parseISO(task.createdAt));
              const dueDate = startOfDay(parseISO(task.dueDate));
              const effectiveStart = createdAt < start ? start : createdAt;
              const effectiveEnd = dueDate > end ? end : dueDate;

              const startCol = days.findIndex((day) =>
                isSameDay(day, effectiveStart),
              );

              const duration = days.filter((day) =>
                isWithinInterval(day, {
                  start: effectiveStart,
                  end: effectiveEnd,
                }),
              ).length;

              return (
                <div key={task.id} className="relative h-12 flex items-center">
                  <div
                    className={cn(
                      "absolute h-8 bg-primary px-4 flex items-center",
                      startOfDay(createdAt) >= startOfDay(start) &&
                        "rounded-l-full",
                      endOfDay(dueDate) <= endOfDay(end) && "rounded-r-full",
                    )}
                    style={{
                      left: `${(startCol / days.length) * 100}%`,
                      width: `${(duration / days.length) * 100}%`,
                    }}
                  >
                    <span className="text-xs font-semibold text-primary-foreground truncate mr-2">
                      {task.name}
                    </span>
                    <TaskStatusBadge status={task.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
