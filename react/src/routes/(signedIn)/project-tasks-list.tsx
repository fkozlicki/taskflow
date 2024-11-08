import { DataTable } from "@/components/data-table.tsx";
import { useParams } from "react-router-dom";
import { useProjectTasks } from "@/hooks/queries/use-project-tasks.ts";
import { taskColumns } from "@/components/task-columns.tsx";

export default function ProjectTasksList() {
  const params = useParams();
  const projectId = params.projectId!;

  const { data } = useProjectTasks(projectId);

  const tasks = !data ? [] : Object.values(data).flat();

  return <DataTable columns={taskColumns} data={tasks} />;
}
