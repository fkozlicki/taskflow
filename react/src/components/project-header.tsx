import { useProject } from "@/hooks/queries/use-project.ts";
import EditProjectSheet from "@/components/edit-project-sheet.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { useParams } from "react-router-dom";

export default function ProjectHeader() {
  const params = useParams();
  const projectId = params.projectId!;
  const { data: project, isPending, isError } = useProject(projectId);

  if (isPending) {
    return (
      <div>
        <Skeleton className="w-64 h-8 animate-pulse" />
        <Skeleton className="w-[300px] sm:w-[450px] h-4 animate-pulse mt-2" />
      </div>
    );
  }

  if (isError) {
    return <div>Couldn't load project data</div>;
  }

  const { name, description } = project;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2">
        <h2 className="text-3xl font-bold">{name}</h2>
        <EditProjectSheet project={project} />
      </div>
      <p className="text-muted-foreground mt-1 text-lg">{description}</p>
    </div>
  );
}
