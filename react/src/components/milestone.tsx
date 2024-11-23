import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Milestone } from "@/hooks/queries/use-milestones.ts";
import { useEditMilestone } from "@/hooks/mutations/use-edit-milestone.ts";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { TrashIcon } from "lucide-react";

export default function MilestoneItem({ milestone }: { milestone: Milestone }) {
  const { mutate } = useEditMilestone();

  const onClick = () => {
    mutate({
      id: milestone.id,
      done: !milestone.done,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Checkbox checked={milestone.done} onClick={onClick} />
      <span
        className={cn(
          "text-sm",
          milestone.done && "line-through text-muted-foreground",
        )}
      >
        {milestone.content}
      </span>
      <Button variant="ghost" size="icon" className="size-5 ml-auto">
        <TrashIcon className="!size-3.5" />
      </Button>
    </div>
  );
}
