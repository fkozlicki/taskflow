package pl.filipkozlicki.taskflow.project.dto;

import lombok.*;
import pl.filipkozlicki.taskflow.project.Project;
import pl.filipkozlicki.taskflow.user.dto.UserResponse;

import java.util.UUID;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProjectItemResponse {
    private UUID id;
    private String name;
    private String description;
    private Integer membersCount;
    private Integer tasksCount;
    private UserResponse owner;

    public ProjectItemResponse(Project project) {
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        this.membersCount = project.getUsers().size();
        this.tasksCount = project.getTasks().size();
        owner = new UserResponse(project.getOwner());
    }
}
