package pl.filipkozlicki.taskflow.task.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTaskRequest {
    private String name;
    private String description;
    private LocalDateTime dueDate;
    private List<UUID> users;
}
