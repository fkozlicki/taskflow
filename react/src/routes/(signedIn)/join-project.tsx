import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useJoinProject } from "@/hooks/mutations/use-join-project.ts";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

export default function JoinProject() {
  const [searchParams] = useSearchParams();
  const {
    mutate,
    isSuccess,
    isPending,
    isError,
    data: project,
  } = useJoinProject();

  const code = searchParams.get("code");
  const token = searchParams.get("token");

  useEffect(() => {
    if (code) {
      mutate({ code });
    }
    if (token) {
      mutate({ token });
    }
  }, []);

  if (!code && !token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="h-screen w-screen grid place-items-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>
            {isError && "We are sorry"}
            {isPending && "Joining project"}
            {isSuccess && `Joined ${project.name}`}
          </CardTitle>
          <CardDescription>
            {isPending && "We are adding you to the project. Please wait."}
            {isError && (
              <>
                We couldn't add you to the project.
                <br />
                Your invitation has terminated or inviter has cancelled it.
              </>
            )}
            {isSuccess && "You can explore it now."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPending && <LoaderIcon className="size-12 animate-spin mx-auto" />}
          {isSuccess && (
            <div className="flex gap-4">
              <Button variant="outline" asChild className="flex-1">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link to={`/projects/${project.id}`}>Project</Link>
              </Button>
            </div>
          )}
          {isError && (
            <div className="flex gap-4">
              <Button className="flex-1" variant="outline" asChild>
                <Link to="/">Home</Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
