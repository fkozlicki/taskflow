package pl.filipkozlicki.taskflow.project.dto;

import lombok.Data;
import pl.filipkozlicki.taskflow.project.Project;

@Data
public class CreateProjectResponse {
    private String id;
    private String name;

    public CreateProjectResponse(Project project) {
        this.id = project.getId();
        this.name = project.getName();
    }
}
