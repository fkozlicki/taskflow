import { useSession } from "@/hooks/queries/use-session.ts";
import { LoaderIcon } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router";
import { publicRoutes } from "@/lib/constants.ts";

export default function SessionWrapper() {
  const { data, isPending } = useSession();
  const { pathname } = useLocation();

  if (isPending) {
    return (
      <div className="w-screen h-screen grid place-items-center bg-background">
        <div className="max-w-lg grid place-items-center">
          <LoaderIcon className="size-8 animate-spin" />
          <p className="text-center mt-2">
            We are loading your session. It might take a while.
          </p>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Service is deployed to Render.com free instance - it will spin down
            with inactivity, which can delay requests by 50 seconds or more.
          </p>
        </div>
      </div>
    );
  }

  if (!data && !publicRoutes.includes(pathname)) {
    return <Navigate to="/sign-in" />;
  }

  if (data && publicRoutes.includes(pathname)) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
}
