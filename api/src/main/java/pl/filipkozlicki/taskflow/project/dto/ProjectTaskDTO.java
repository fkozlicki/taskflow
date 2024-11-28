package pl.filipkozlicki.taskflow.project.dto;

import lombok.Data;
import lombok.Getter;
import pl.filipkozlicki.taskflow.task.Task;
import pl.filipkozlicki.taskflow.user.dto.UserResponse;

import java.time.LocalDateTime;
import java.util.List;

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
    List<UserResponse> users;

    public ProjectTaskDTO(Task task) {
        this.id = task.getId();
        this.name = task.getName();
        this.description = task.getDescription();
        this.createdAt = task.getCreatedAt();
        this.dueDate = task.getDueDate();
        this.status = task.getStatus();
        this.position = task.getPosition();
        this.users = task.getUsers().stream().map(UserResponse::new).toList();
    }
}
