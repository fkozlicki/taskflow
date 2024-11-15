import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import {
  BellIcon,
  ChevronsUpDownIcon,
  LayoutDashboard,
  LogOutIcon,
  SettingsIcon,
} from "lucide-react";
import { useSession } from "@/hooks/queries/use-session.ts";
import { Button } from "@/components/ui/button.tsx";
import { useSignOut } from "@/hooks/mutations/use-sign-out.ts";
import { Link } from "react-router-dom";

export default function UserMenu() {
  const { data } = useSession();
  const { mutate, isPending } = useSignOut();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="lg" className="p-2 h-12">
          <Avatar className="h-8 w-8 rounded-lg">
            {/*<AvatarImage src={user.avatar} alt={user.name} />*/}
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{data?.name}</span>
            <span className="truncate text-xs">{data?.email}</span>
          </div>
          <ChevronsUpDownIcon className="ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="right"
        align="end"
        sideOffset={4}
        className="min-w-56"
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              {/*<AvatarImage src={user.avatar} alt={user.name} />*/}
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{data?.name}</span>
              <span className="truncate text-xs">{data?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to="/dashboard">
          <DropdownMenuItem>
            <LayoutDashboard />
            Dashboard
          </DropdownMenuItem>
        </Link>

        <Link to="/notifications">
          <DropdownMenuItem>
            <BellIcon />
            Notifications
          </DropdownMenuItem>
        </Link>

        <Link to="/settings">
          <DropdownMenuItem>
            <SettingsIcon />
            Settings
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={isPending} onClick={() => mutate()}>
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
