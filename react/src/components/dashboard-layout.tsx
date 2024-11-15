import DashboardSidebar from "@/components/dashboard-sidebar.tsx";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <div className="p-2 h-screen w-screen flex gap-4">
      <DashboardSidebar />
      <div className="flex-1 border rounded-lg bg-slate-50 dark:bg-slate-900 p-4">
        <Outlet />
      </div>
    </div>
  );
}
