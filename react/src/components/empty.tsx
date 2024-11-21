import { FolderOpenIcon, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils.ts";

export default function Empty({
  Icon = FolderOpenIcon,
  text = "Empty",
  className,
}: {
  Icon?: LucideIcon;
  text?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid text-muted-foreground place-content-center place-items-center gap-1",
        className,
      )}
    >
      <Icon className="size-10" />
      <span className="font-medium text-sm">{text}</span>
    </div>
  );
}
