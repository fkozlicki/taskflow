import { useParams } from "react-router-dom";
import { useProject } from "@/hooks/queries/use-project.ts";
import InviteToProjectDialog from "@/components/invite-to-project-dialog.tsx";

export default function Project() {
  const { projectId } = useParams();
  const { data, isPending, isError } = useProject(projectId!);

  if (isPending) {
    return <div>Loading</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  const { name } = data;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-3xl font-bold">{name}</h2>
        <p className="text-muted-foreground mt-1 text-lg">lorem ipsum</p>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Members</span>
          <InviteToProjectDialog project={data} />
        </div>
      </div>
    </div>
  );
}
