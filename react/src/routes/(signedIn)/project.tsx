import { useParams } from "react-router-dom";
import { useProject } from "@/hooks/queries/use-project.ts";
import EditProjectSheet from "@/components/edit-project-sheet.tsx";
import ProjectMilestones from "@/components/project-milestones.tsx";
import ProjectMembers from "@/components/project-members.tsx";
import ProjectUpcomingEvents from "@/components/project-upcoming-events.tsx";

export default function Project() {
  const params = useParams();
  const projectId = params.projectId!;
  const { data, isPending, isError } = useProject(projectId);

  if (isPending) {
    return <div>Loading</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  const { name, description } = data;

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-bold">{name}</h2>
          <EditProjectSheet project={data} />
        </div>
        <p className="text-muted-foreground mt-1 text-lg">{description}</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <ProjectMilestones projectId={projectId} />
        <ProjectMembers project={data} />
        <ProjectUpcomingEvents />
      </div>
    </div>
  );
}
