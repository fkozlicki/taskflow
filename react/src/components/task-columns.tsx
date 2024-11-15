import { ColumnDef } from "@tanstack/react-table";
import { Task } from "@/hooks/queries/use-project-tasks.ts";
import TaskStatusBadge from "@/components/task-status-badge.tsx";
import { format } from "date-fns";

export const taskColumns: ColumnDef<Task>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue<string>();

      return <TaskStatusBadge status={status} />;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ getValue }) => format(getValue<string>(), "P"),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ getValue }) => format(getValue<string>(), "P"),
  },
];
