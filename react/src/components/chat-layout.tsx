import { useNavigate, useParams } from "react-router-dom";
import { useProject } from "@/hooks/queries/use-project.ts";
import { useSession } from "@/hooks/queries/use-session.ts";
import { useGetOrCreateChat } from "@/hooks/mutations/use-get-or-create-chat.ts";
import { Button } from "@/components/ui/button.tsx";
import { Outlet } from "react-router";
import { StompSessionProvider } from "react-stomp-hooks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import Empty from "@/components/empty.tsx";

export default function ChatLayout() {
  const params = useParams();
  const projectId = params.projectId!;

  const { data } = useProject(projectId);
  const { data: user } = useSession();
  const { mutate } = useGetOrCreateChat();
  const navigate = useNavigate();

  const goToChat = (userId: string) => {
    mutate(
      {
        userId,
        projectId,
      },
      {
        onSuccess(data) {
          navigate(`/projects/${projectId}/chat/${data.id}`);
        },
        onError(err) {
          console.log(err);
        },
      },
    );
  };

  const users = data?.members.filter((u) => u.id !== user?.id) ?? [];

  return (
    <StompSessionProvider url="http://localhost:8080/ws">
      <div className="h-full flex flex-col">
        <span className="text-3xl font-semibold inline-block mb-6">Chat</span>
        <div className="bg-background border rounded-lg flex flex-1 max-h-full overflow-hidden">
          <div className="min-w-[250px] border-r p-2 flex flex-col">
            <span className="text-muted-foreground text-xs uppercase flex font-semibold mb-2">
              chats
            </span>
            <div className="flex flex-col flex-1">
              {users.length > 0 ? (
                users.map((user) => (
                  <Button
                    onClick={() => goToChat(user.id)}
                    variant="ghost"
                    key={user.id}
                    className="justify-start h-12 p-2"
                  >
                    <Avatar className="size-8">
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {user.name}
                  </Button>
                ))
              ) : (
                <Empty
                  className="flex-1 h-full"
                  text="No users in the project"
                />
              )}
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </StompSessionProvider>
  );
}
