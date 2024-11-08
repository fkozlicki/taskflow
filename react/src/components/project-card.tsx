import { Project } from "@/hooks/queries/use-projects.ts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Link } from "react-router-dom";

export default function ProjectCard({ project }: { project: Project }) {
  const { id, name } = project;

  return (
    <Link to={`/projects/${id}`}>
      <Card>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardContent>asdasd</CardContent>
      </Card>
    </Link>
  );
}
