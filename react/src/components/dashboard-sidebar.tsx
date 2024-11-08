import Sidebar from "@/components/sidebar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link, useLocation, useParams } from "react-router-dom";
import { HomeIcon, SettingsIcon } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Home", Icon: HomeIcon },
  { href: "/settings", label: "Settings", Icon: SettingsIcon },
];

export default function DashboardSidebar() {
  const params = useParams();
  const { pathname } = useLocation();

  return (
    <Sidebar>
      <div className="flex flex-col mt-4 flex-1">
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
