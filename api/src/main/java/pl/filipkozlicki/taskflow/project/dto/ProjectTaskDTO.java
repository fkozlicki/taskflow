package pl.filipkozlicki.taskflow.project.dto;

import lombok.Data;
import lombok.Getter;
import pl.filipkozlicki.taskflow.task.Task;

import java.time.LocalDateTime;

@Data
@Getter
public class ProjectTaskDTO {
    String id;
    String name;
    String description;
    LocalDateTime createdAt;
    LocalDateTime dueDate;
    String status;
    int position;

    public ProjectTaskDTO(Task task) {
        this.id = task.getId();
        this.name = task.getName();
        this.description = task.getDescription();
        this.createdAt = task.getCreatedAt();
        this.dueDate = task.getDueDate();
        this.status = task.getStatus();
        this.position = task.getPosition();
    }
}
