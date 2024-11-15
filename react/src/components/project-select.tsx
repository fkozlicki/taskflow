import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { Project } from "@/hooks/queries/use-projects.ts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { PuzzleIcon } from "lucide-react";

export default function ProjectSelect({ projects }: { projects: Project[] }) {
  const params = useParams();
  const navigate = useNavigate();

  const project = projects.find((p) => p.id === params.projectId);

  return (
    <Select
      value={params.projectId}
      onValueChange={(value) => {
        navigate(`/projects/${value}`);
      }}
    >
      <SelectTrigger className="h-12 px-2">
        <SelectValue placeholder="Select a project">
          <div className="flex gap-2 items-center">
            <Avatar className="size-8 rounded-md">
              <AvatarFallback className="rounded-md">
                <PuzzleIcon className="size-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-xs">Project</span>
              <span className="font-medium">{project?.name}</span>
            </div>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel className="text-xs">Projects</SelectLabel>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              <div className="flex gap-2 items-center">
                <Avatar className="size-6 rounded-md">
                  <AvatarFallback className="rounded-md">
                    <PuzzleIcon className="size-3" />
                  </AvatarFallback>
                </Avatar>
                <div className="grid">
                  <span>{project.name}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
