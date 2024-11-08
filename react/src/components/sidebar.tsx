import UserMenu from "@/components/user-menu.tsx";
import { PropsWithChildren } from "react";
import ThemeDropdown from "@/components/theme-dropdown.tsx";

export default function Sidebar({ children }: PropsWithChildren) {
  return (
    <div className="min-w-[250px] flex flex-col">
      {children}
      <ThemeDropdown />
      <UserMenu />
    </div>
  );
}
