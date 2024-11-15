import Sidebar from "@/components/sidebar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link, useLocation } from "react-router-dom";
import { BellIcon, HomeIcon, SettingsIcon } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Home", Icon: HomeIcon },
  { href: "/notifications", label: "Notifications", Icon: BellIcon },
  { href: "/settings", label: "Settings", Icon: SettingsIcon },
];

export default function DashboardSidebar() {
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
            <Link to={link.href}>
              <link.Icon className="size-4 mr-2" />
              {link.label}
            </Link>
          </Button>
        ))}
      </div>
    </Sidebar>
  );
}
