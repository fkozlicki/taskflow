package pl.filipkozlicki.taskflow.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import pl.filipkozlicki.taskflow.milestone.dto.MilestoneResponse;
import pl.filipkozlicki.taskflow.project.Project;

import java.util.List;
import java.util.UUID;

@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectResponse {
    private UUID id;
    private String name;
    private List<ProjectMember> members;
    private List<MilestoneResponse> milestones;
    private String description;
    private String invitationCode;
    @JsonProperty("isOwner")
    private boolean isOwner;

    public ProjectResponse(Project project) {
        this.id = project.getId();
        this.name = project.getName();
        this.members = project.getUsers().stream().map(ProjectMember::new).toList();
        this.description = project.getDescription();
        this.milestones = project.getMilestones().stream().map(MilestoneResponse::new).toList();
    }

    public ProjectResponse(Project project, boolean isOwner) {
        this.id = project.getId();
        this.name = project.getName();
        this.members = project.getUsers().stream().map(ProjectMember::new).toList();
        this.description = project.getDescription();
        this.invitationCode = project.getInvitationCode();
        this.isOwner = isOwner;
        this.milestones = project.getMilestones().stream().map(MilestoneResponse::new).toList();
    }
}
