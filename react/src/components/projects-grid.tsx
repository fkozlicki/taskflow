import { useProjects } from "@/hooks/queries/use-projects.ts";
import ProjectCard from "@/components/project-card.tsx";

export default function ProjectsGrid() {
  const { data, isPending, isError } = useProjects();

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>Error</div>;

  return (
    <div className="grid grid-cols-4">
      {data.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
