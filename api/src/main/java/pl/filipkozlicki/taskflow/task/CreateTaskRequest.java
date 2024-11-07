package pl.filipkozlicki.taskflow.task;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CreateTaskRequest {
    private String name;
    private String description;
    private String projectId;
    private LocalDateTime dueDate;
    private Integer position;
    private String status;
}
