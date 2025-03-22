import { useProjects } from "@/hooks/queries/use-projects.ts";
import ProjectCard from "@/components/project-card.tsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";

export default function ProjectsGrid() {
  const { data, isPending, isError } = useProjects();

  if (isPending) {
    return <ProjectsGridSkeleton />;
  }

  if (isError) return <div>Couldn't load your projects</div>;

  return (
    <div id="projects-grid" className="grid grid-cols-4 gap-4">
      {data.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

function ProjectsGridSkeleton() {
  return (
    <div id="projects-grid-skeleton" className="grid grid-cols-4 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="flex gap-2">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-16 h-4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
