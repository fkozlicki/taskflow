import { Outlet } from "react-router";
import ProjectSelect from "@/components/project-select.tsx";
import { useProjects } from "@/hooks/queries/use-projects.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  Calendar1Icon,
  FileTextIcon,
  HomeIcon,
  MessageCircleIcon,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

const links = [
  { href: "/tasks", label: "Tasks", Icon: FileTextIcon },
  { href: "/schedule", label: "Schedule", Icon: Calendar1Icon },
  { href: "/chat", label: "Chat", Icon: MessageCircleIcon },
];

export default function ProjectLayout() {
  const { data } = useProjects();
  const params = useParams();
  const { pathname } = useLocation();

  return (
    <div className="p-2 flex gap-4 h-screen">
      <div className="min-w-[250px]">
        {data && <ProjectSelect projects={data} />}
        <div className="grid mt-4">
          <Button
            className="justify-start"
            variant={
              pathname === `/projects/${params.projectId}` ||
              pathname === "/dashboard"
                ? "default"
                : "ghost"
            }
            asChild
          >
            <Link
              to={
                params.projectId
                  ? `/projects/${params.projectId}`
                  : "/dashboard"
              }
            >
              <HomeIcon className="size-4 mr-2" />
              Home
            </Link>
          </Button>

          {links.map((link) => (
            <Button
              asChild
              key={link.href}
              variant={pathname.endsWith(link.href) ? "default" : "ghost"}
              className="justify-start"
            >
              <Link to={`/projects/${params.projectId}${link.href}`}>
                <link.Icon className="size-4 mr-2" />
                {link.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 border rounded-2xl p-2">
        <Outlet />
      </div>
    </div>
  );
}
