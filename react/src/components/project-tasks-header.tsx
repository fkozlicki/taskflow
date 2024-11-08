import { Link, useLocation, useParams } from "react-router-dom";
import { useProject } from "@/hooks/queries/use-project.ts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";

export default function ProjectTasksHeader() {
  const params = useParams();
  const projectId = params.projectId;
  const { pathname } = useLocation();

  const { data } = useProject(projectId!);

  const base = `/projects/${projectId}/tasks`;

  const segment =
    pathname === base ? "board" : (pathname.split("/").pop() ?? "board");

  if (!data) {
    return <div>Loading</div>;
  }

  return (
    <div className="mb-6">
      <h2 className="text-3xl font-semibold mb-2">{data.name}</h2>
      <Tabs value={segment} className="w-[400px]">
        <TabsList>
          <Link to={`/projects/${projectId}/tasks`}>
            <TabsTrigger value="board">Board</TabsTrigger>
          </Link>
          <Link to={`/projects/${projectId}/tasks/list`}>
            <TabsTrigger value="list">List</TabsTrigger>
          </Link>
          <Link to={`/projects/${projectId}/tasks/timeline`}>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
    </div>
  );
}
