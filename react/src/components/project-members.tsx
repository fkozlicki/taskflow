import InviteToProjectDialog from "@/components/invite-to-project-dialog.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { UserIcon } from "lucide-react";
import { ProjectDetails } from "@/hooks/queries/use-project.ts";

export default function ProjectMembers({
  project,
}: {
  project: ProjectDetails;
}) {
  const { isOwner, members } = project;

  return (
    <Card>
      <CardHeader className="border-b p-3 flex-row justify-between space-y-0">
        <div className="flex items-center">
          <CardTitle>Members</CardTitle>
          <div className="bg-gray-400 text-xs w-4 h-4 ml-1.5 rounded grid place-items-center text-gray-100 font-semibold">
            {members.length}
          </div>
        </div>
        {isOwner && <InviteToProjectDialog project={project} />}
      </CardHeader>
      <CardContent className="p-3 min-h-48 flex flex-col gap-2">
        {members.map((member) => (
          <div key={member.id}>
            <div className="flex items-center gap-2">
              <Avatar className="size-9">
                <AvatarFallback>
                  <UserIcon className="size-4 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">{member.name}</span>
                <span className="text-xs text-muted-foreground">
                  {member.email}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
