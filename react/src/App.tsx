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

const publicRoutes = ["/home", "/sign-up", "/sign-in"];

function App() {
  const { data } = useSession();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (data && publicRoutes.includes(pathname)) {
      navigate("/dashboard");
    }
  }, [data]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route element={<ProjectLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects/:projectId">
          <Route path="" element={<Project />} />
          <Route path="tasks" element={<ProjectTasks />} />
          <Route path="schedule" element={<ProjectSchedule />} />
          <Route path="chat" element={<ProjectChat />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
