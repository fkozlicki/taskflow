import { ProjectDetails } from "@/hooks/queries/use-project.ts";
import { Checkbox } from "@/components/ui/checkbox.tsx";

export default function Milestone({
  milestone,
}: {
  milestone: ProjectDetails["milestones"][number];
}) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={milestone.done}
        onClick={() => {
          console.log("Clicked");
        }}
      />
      <span className="text-sm">{milestone.content}</span>
    </div>
  );
}
