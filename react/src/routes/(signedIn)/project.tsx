import { useParams } from "react-router-dom";
import { useProject } from "@/hooks/queries/use-project.ts";

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
      <h2 className="text-3xl font-bold">{name}</h2>
    </div>
  );
}
