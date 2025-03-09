import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Milestone } from "@/hooks/queries/use-milestones.ts";
import { useEditMilestone } from "@/hooks/mutations/use-edit-milestone.ts";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { TrashIcon } from "lucide-react";
import { useDeleteMilestone } from "@/hooks/mutations/use-delete-milestone.ts";

export default function MilestoneItem({ milestone }: { milestone: Milestone }) {
  const editMilestone = useEditMilestone();
  const deleteMilestone = useDeleteMilestone();

  const onMark = () => {
    editMilestone.mutate({
      id: milestone.id,
      done: !milestone.done,
    });
  };

  const onDelete = () => {
    deleteMilestone.mutate(milestone.id);
  };

  return (
    <div className="flex items-center gap-2">
      <Checkbox checked={milestone.done} onClick={onMark} />
      <span
        className={cn(
          "text-sm",
          milestone.done && "line-through text-muted-foreground",
        )}
      >
        {milestone.content}
      </span>
      <Button
        onClick={onDelete}
        variant="ghost"
        size="icon"
        className="size-5 ml-auto"
      >
        <TrashIcon className="!size-3.5" />
      </Button>
    </div>
  );
}
