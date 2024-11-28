package pl.filipkozlicki.taskflow.task.dto;

import lombok.Data;
import pl.filipkozlicki.taskflow.task.Task;
import pl.filipkozlicki.taskflow.user.dto.UserResponse;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Data
public class TaskResponse {
    private String id;
    private String name;
    private String status;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime dueDate;
    private Set<UserResponse> users;

    public TaskResponse(Task task) {
        this.id = task.getId();
        this.name = task.getName();
        this.status = task.getStatus();
        this.description = task.getDescription();
        this.createdAt = task.getCreatedAt();
        this.dueDate = task.getDueDate();
        this.users = task
                .getUsers()
                .stream()
                .map(
                        user -> UserResponse
                                .builder()
                                .id(user.getId())
                                .name(user.getName())
                                .email(user.getEmail())
                                .build()
                )
                .collect(Collectors.toSet());
    }
}
