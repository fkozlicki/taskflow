import { useState } from "react";
import CreateProjectSheet from "@/components/create-project-sheet.tsx";
import { Button } from "@/components/ui/button.tsx";
import { PlusIcon } from "lucide-react";
import ProjectsGrid from "@/components/projects-grid.tsx";

function YourProjects() {
  const [createProjectOpen, setCreateProjectOpen] = useState<boolean>(false);

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
      <ProjectsGrid />
    </div>
  );
}

export default YourProjects;
