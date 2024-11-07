package pl.filipkozlicki.taskflow.task;

import lombok.Data;
import pl.filipkozlicki.taskflow.user.User;
import pl.filipkozlicki.taskflow.user.UserDTO;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Data
public class CreateTaskResponse {
    private String id;
    private String name;
    private String status;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime dueDate;
    private Set<UserDTO> users;

    public CreateTaskResponse(Task task) {
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
                        user -> UserDTO
                                .builder()
                                .id(user.getId())
                                .name(user.getName())
                                .email(user.getEmail())
                                .build()
                )
                .collect(Collectors.toSet());
    }
}
