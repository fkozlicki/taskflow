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

export default function ProjectSelect({ projects }: { projects: Project[] }) {
  const params = useParams();
  const navigate = useNavigate();

  return (
    <Select
      value={params.projectId}
      onValueChange={(value) => {
        navigate(`/projects/${value}`);
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a project" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Projects</SelectLabel>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
