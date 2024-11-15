import { useParams } from "react-router-dom";
import { useProject } from "@/hooks/queries/use-project.ts";
import InviteToProjectDialog from "@/components/invite-to-project-dialog.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { UserIcon } from "lucide-react";
import EditProjectSheet from "@/components/edit-project-sheet.tsx";

export default function Project() {
  const { projectId } = useParams();
  const { data, isPending, isError } = useProject(projectId!);

  if (isPending) {
    return <div>Loading</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  const { name, description, members, isOwner } = data;

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-bold">{name}</h2>
          <EditProjectSheet project={data} />
        </div>
        <p className="text-muted-foreground mt-1 text-lg">{description}</p>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium">Members</span>
          {isOwner && <InviteToProjectDialog project={data} />}
        </div>
        <div className="flex gap-2">
          {members.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-4 flex items-center gap-2">
                <Avatar className="size-9">
                  <AvatarFallback>
                    <UserIcon className="size-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="font-medium text-sm">{member.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {member.email}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
