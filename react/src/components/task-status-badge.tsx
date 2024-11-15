import { Badge } from "@/components/ui/badge.tsx";
import { Task } from "@/hooks/queries/use-project-tasks.ts";
import { columns } from "@/lib/constants.ts";

export default function TaskStatusBadge({
  status,
}: {
  status: Task["status"];
}) {
  const column = columns.find((col) => col.id === status)!;

  return (
    <Badge
      variant="outline"
      className="rounded-full"
      style={{
        borderColor: column.color,
        backgroundColor: `${column.color}20`,
        color: column.color,
      }}
    >
      {column.label}
    </Badge>
  );
}
