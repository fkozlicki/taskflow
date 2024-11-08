import ProjectSelect from "@/components/project-select.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Calendar1Icon,
  FileTextIcon,
  HomeIcon,
  MessageCircleIcon,
} from "lucide-react";
import { useProjects } from "@/hooks/queries/use-projects.ts";
import Sidebar from "@/components/sidebar.tsx";

const links = [
  { href: "/tasks", label: "Tasks", Icon: FileTextIcon },
  { href: "/schedule", label: "Schedule", Icon: Calendar1Icon },
  { href: "/chat", label: "Chat", Icon: MessageCircleIcon },
];

export default function ProjectSidebar() {
  const { data } = useProjects();
  const params = useParams();
  const { pathname } = useLocation();

  return (
    <Sidebar>
      {data && <ProjectSelect projects={data} />}
      <div className="flex flex-col mt-4 flex-1">
        <Button
          className="justify-start"
          variant={
            pathname === `/projects/${params.projectId}` ? "default" : "ghost"
          }
          asChild
        >
          <Link to={`/projects/${params.projectId}`}>
            <HomeIcon className="size-4 mr-2" />
            Home
          </Link>
        </Button>

        {links.map((link) => (
          <Button
            asChild
            key={link.href}
            variant={pathname.includes(link.href) ? "default" : "ghost"}
            className="justify-start"
          >
            <Link to={`/projects/${params.projectId}${link.href}`}>
              <link.Icon className="size-4 mr-2" />
              {link.label}
            </Link>
          </Button>
        ))}
      </div>
    </Sidebar>
  );
}
