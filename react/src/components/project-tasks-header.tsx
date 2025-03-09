import { Link, useLocation, useParams } from "react-router-dom";
import { useProject } from "@/hooks/queries/use-project.ts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";

export default function ProjectTasksHeader() {
  const params = useParams();
  const projectId = params.projectId!;

  return (
    <div>
      <ProjectName projectId={projectId} />
      <ProjectTabs projectId={projectId} />
    </div>
  );
}

function ProjectName({ projectId }: { projectId: string }) {
  const { data, isPending, isError } = useProject(projectId);

  if (isPending) {
    return <Skeleton className="h-8 w-[350px] mb-2" />;
  }

  if (isError) {
    return (
      <h2 className="text-3xl font-semibold mb-2">
        Couldn't load project name
      </h2>
    );
  }

  return <h2 className="text-3xl font-semibold mb-2">{data.name}</h2>;
}

function ProjectTabs({ projectId }: { projectId: string }) {
  const { pathname } = useLocation();

  const base = `/projects/${projectId}/tasks`;

  const segment =
    pathname === base ? "board" : (pathname.split("/").pop() ?? "board");

  return (
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
  );
}
