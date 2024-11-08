import { useSession } from "@/hooks/queries/use-session.ts";
import ProjectsGrid from "@/components/projects-grid.tsx";
import DashboardSidebar from "@/components/dashboard-sidebar.tsx";

export default function Dashboard() {
  const { data: user } = useSession();

  return (
    <div className="p-2 h-screen w-screen flex gap-4">
      <DashboardSidebar />
      <div className="flex-1 border rounded-lg bg-slate-50 dark:bg-slate-900 p-4">
        <div className="mb-4">
          <h1 className="text-3xl font-semibold">Hi, {user?.name}</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to Taskflow dashboard
          </p>
        </div>

        <ProjectsGrid />
      </div>
    </div>
  );
}
