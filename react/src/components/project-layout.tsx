import { Outlet } from "react-router";
import ProjectSidebar from "@/components/project-sidebar.tsx";

export default function ProjectLayout() {
  return (
    <div className="p-2 flex gap-4 h-screen">
      <ProjectSidebar />
      <div className="flex-1 flex flex-col border rounded-2xl p-4 bg-slate-50 dark:bg-slate-900">
        <Outlet />
      </div>
    </div>
  );
}
