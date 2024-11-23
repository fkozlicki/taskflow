import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import Empty from "@/components/empty.tsx";
import CreateMilestoneSheet from "@/components/create-milestone-sheet.tsx";
import Milestone from "@/components/milestone.tsx";
import { useMilestones } from "@/hooks/queries/use-milestones.ts";

export default function ProjectMilestones({
  projectId,
}: {
  projectId: string;
}) {
  const { data } = useMilestones(projectId);

  return (
    <Card>
      <CardHeader className="border-b p-3 flex-row justify-between space-y-0">
        <div className="flex items-center">
          <CardTitle>Milestones</CardTitle>
          <div className="bg-gray-400 text-xs w-4 h-4 ml-1.5 rounded grid place-items-center text-gray-100 font-semibold">
            {data?.length}
          </div>
        </div>

        <CreateMilestoneSheet />
      </CardHeader>
      <CardContent className="p-3 min-h-48 flex">
        {data && data.length > 0 ? (
          <div className="flex flex-col gap-2 w-full">
            {data.map((milestone) => (
              <Milestone key={milestone.id} milestone={milestone} />
            ))}
          </div>
        ) : (
          <Empty className="flex-1" text="No milestones" />
        )}
      </CardContent>
    </Card>
  );
}
