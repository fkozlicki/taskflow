import { Outlet } from "react-router";
import ProjectSidebar from "@/components/project-sidebar.tsx";
import { useParams } from "react-router-dom";
import { useProject } from "@/hooks/queries/use-project.ts";

export default function ProjectLayout() {
  const params = useParams();
  const projectId = params.projectId!;

  const { isPending, isError } = useProject(projectId);

  if (isPending) {
    return <div>Loading</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className="p-2 flex gap-4 h-screen">
      <ProjectSidebar />
      <div className="flex-1 flex flex-col border rounded-2xl p-4 bg-slate-50 dark:bg-slate-900">
        <Outlet />
      </div>
    </div>
  );
}
