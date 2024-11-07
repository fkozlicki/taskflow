package pl.filipkozlicki.taskflow.project;

import lombok.Data;

@Data
public class CreateProjectResponse {
    private String id;
    private String name;

    public CreateProjectResponse(Project project) {
        this.id = project.getId();
        this.name = project.getName();
    }
}
