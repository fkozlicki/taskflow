import ProjectMilestones from "@/components/project-milestones.tsx";
import ProjectMembers from "@/components/project-members.tsx";
import ProjectUpcomingEvents from "@/components/project-upcoming-events.tsx";
import ProjectHeader from "@/components/project-header.tsx";

export default function Project() {
  return (
    <div className="space-y-8">
      <ProjectHeader />
      <div className="grid grid-cols-3 gap-4">
        <ProjectMilestones />
        <ProjectMembers />
        <ProjectUpcomingEvents />
      </div>
    </div>
  );
}
