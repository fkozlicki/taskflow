package pl.filipkozlicki.taskflow.project;

import lombok.Data;

@Data
public class ProjectResponse {
    private String id;
    private String name;

    public ProjectResponse(Project project) {
        this.id = project.getId();
        this.name = project.getName();
    }
}
