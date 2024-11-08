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

const publicRoutes = ["/home", "/sign-up", "/sign-in"];

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
      <Route path="/dashboard" element={<Dashboard />} />
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
