import { Project } from "@/hooks/queries/use-projects.ts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge.tsx";
import { UserIcon } from "lucide-react";

export default function ProjectCard({ project }: { project: Project }) {
  const { id, name, description, owner, tasksCount, membersCount } = project;

  return (
    <Link to={`/projects/${id}`}>
      <Card>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="rounded-full">
            <UserIcon className="size-3.5 mr-1" />
            <span>{owner.name}</span>
          </Badge>
          <Badge>Members: {membersCount}</Badge>
          <Badge>Tasks: {tasksCount}</Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
