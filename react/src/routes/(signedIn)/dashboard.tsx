import { useSession } from "@/hooks/queries/use-session.ts";
import YourProjects from "@/components/your-projects.tsx";

export default function Dashboard() {
  const { data: user } = useSession();

  return (
    <>
      <div className="mb-4">
        <h1 className="text-3xl font-semibold">Hi, {user?.name}</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to Taskflow dashboard
        </p>
      </div>

      <YourProjects />
    </>
  );
}
