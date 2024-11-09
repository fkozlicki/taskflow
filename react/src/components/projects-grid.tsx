import { useProjects } from "@/hooks/queries/use-projects.ts";
import ProjectCard from "@/components/project-card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { PlusIcon } from "lucide-react";
import CreateProjectSheet from "@/components/create-project-sheet.tsx";
import { useState } from "react";

export default function ProjectsGrid() {
  const { data, isPending, isError } = useProjects();
  const [createProjectOpen, setCreateProjectOpen] = useState<boolean>(false);

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>Error</div>;

  return (
    <div>
      <CreateProjectSheet
        open={createProjectOpen}
        onOpenChange={setCreateProjectOpen}
      />
      <div className="flex items-center gap-2 mb-4">
        <span className="font-semibold text-lg">Your projects</span>
        <Button
          size="icon"
          variant="ghost"
          className="size-6"
          onClick={() => setCreateProjectOpen(true)}
        >
          <PlusIcon />
          <span className="sr-only">Create Project</span>
        </Button>
      </div>
      <div className="grid grid-cols-4">
        {data.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
