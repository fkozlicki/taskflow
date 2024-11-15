package pl.filipkozlicki.taskflow.task;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CreateTaskRequest {
    private String name;
    private String description;
    private UUID projectId;
    private LocalDateTime dueDate;
    private Integer position;
    private String status;
    private List<UUID> users;
}
