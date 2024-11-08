import ProjectTasksHeader from "@/components/project-tasks-header.tsx";
import { Outlet } from "react-router";

export default function ProjectTasksLayout() {
  return (
    <div className="flex flex-col h-full">
      <ProjectTasksHeader />
      <Outlet />
    </div>
  );
}
