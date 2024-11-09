package pl.filipkozlicki.taskflow.project.dto;

import lombok.Data;
import pl.filipkozlicki.taskflow.project.Project;

import java.util.List;

@Data
public class ProjectResponse {
    private String id;
    private String name;
    private List<ProjectMember> members;

    public ProjectResponse(Project project) {
        this.id = project.getId();
        this.name = project.getName();
        this.members = project.getUsers().stream().map(ProjectMember::new).toList();
    }
}
