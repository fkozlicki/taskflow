import { ColumnDef } from "@tanstack/react-table";
import { Task } from "@/hooks/queries/use-project-tasks.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { cn } from "@/lib/utils.ts";
import { columns } from "@/lib/constants.ts";

export const taskColumns: ColumnDef<Task>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue<string>();
      const column = columns.find((col) => col.id === status)!;

      return (
        <Badge
          variant="outline"
          className={cn("rounded-full", {
            "": status === "todo",
          })}
          style={{
            borderColor: column.color,
            backgroundColor: `${column.color}20`,
            color: column.color,
          }}
        >
          {column.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
];
