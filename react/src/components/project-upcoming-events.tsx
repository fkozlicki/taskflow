import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import Empty from "@/components/empty.tsx";

export default function ProjectUpcomingEvents() {
  return (
    <Card>
      <CardHeader className="border-b p-3">
        <div className="flex items-center min-h-5">
          <CardTitle>Upcoming events</CardTitle>
          <div className="bg-gray-400 text-xs w-4 h-4 ml-1.5 rounded grid place-items-center text-gray-100 font-semibold">
            {0}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 min-h-48 flex">
        <Empty className="flex-1" text="No upcoming events" />
      </CardContent>
    </Card>
  );
}
