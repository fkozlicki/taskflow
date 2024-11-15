import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import NotFound from "@/routes/not-found.tsx";
import Home from "@/routes/(public)/home.tsx";
import SignIn from "@/routes/(public)/sign-in.tsx";
import SignUp from "@/routes/(public)/sign-up.tsx";
import { useSession } from "@/hooks/queries/use-session.ts";
import { useEffect } from "react";
import Dashboard from "@/routes/(signedIn)/dashboard.tsx";
import ProjectLayout from "@/components/project-layout.tsx";
import Project from "@/routes/(signedIn)/project.tsx";
import ProjectTasks from "@/routes/(signedIn)/project-tasks.tsx";
import ProjectSchedule from "@/routes/(signedIn)/project-schedule.tsx";
import ProjectChat from "@/routes/(signedIn)/project-chat.tsx";
import ProjectTasksLayout from "@/components/project-tasks-layout.tsx";
import ProjectTasksTimeline from "@/routes/(signedIn)/project-tasks-timeline.tsx";
import ProjectTasksList from "@/routes/(signedIn)/project-tasks-list.tsx";
import Verify from "@/routes/(public)/verify.tsx";
import JoinProject from "@/routes/(signedIn)/join-project.tsx";
import Settings from "@/routes/(signedIn)/settings.tsx";
import DashboardLayout from "@/components/dashboard-layout.tsx";
import Notifications from "@/routes/(signedIn)/notifications.tsx";

const publicRoutes = ["/", "/sign-up", "/sign-in", "/verify"];

function App() {
  const { data, isPending } = useSession();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (data && publicRoutes.includes(pathname)) {
      navigate("/dashboard");
    }
    if (!isPending && !data && !publicRoutes.includes(pathname)) {
      navigate("/sign-in");
    }
  }, [data, isPending, navigate, pathname]);

  if (isPending) {
    return null;
  }

  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/verify" element={<Verify />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>

      <Route path="/projects/join" element={<JoinProject />} />

      <Route element={<ProjectLayout />}>
        <Route path="/projects/:projectId">
          <Route path="" element={<Project />} />
          <Route path="tasks" element={<ProjectTasksLayout />}>
            <Route path="" element={<ProjectTasks />} />
            <Route path="list" element={<ProjectTasksList />} />
            <Route path="timeline" element={<ProjectTasksTimeline />} />
          </Route>
          <Route path="schedule" element={<ProjectSchedule />} />
          <Route path="chat" element={<ProjectChat />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
