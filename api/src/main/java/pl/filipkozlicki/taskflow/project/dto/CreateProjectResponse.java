package pl.filipkozlicki.taskflow.project.dto;

import lombok.Data;
import pl.filipkozlicki.taskflow.project.Project;

import java.util.UUID;

@Data
public class CreateProjectResponse {
    private UUID id;
    private String name;

    public CreateProjectResponse(Project project) {
        this.id = project.getId();
        this.name = project.getName();
    }
}
