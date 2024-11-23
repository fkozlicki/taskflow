package pl.filipkozlicki.taskflow.task;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.filipkozlicki.taskflow.exception.ResourceNotFoundException;
import pl.filipkozlicki.taskflow.task.dto.CreateTaskRequest;
import pl.filipkozlicki.taskflow.task.dto.TaskResponse;
import pl.filipkozlicki.taskflow.task.dto.UpdateTaskRequest;
import pl.filipkozlicki.taskflow.user.User;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponse> create(
            @RequestBody CreateTaskRequest request
    ) {
        Task task = taskService.create(request);

        return ResponseEntity
                .status(201)
                .body(new TaskResponse(task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> update(
            @PathVariable String id,
            @RequestBody UpdateTaskRequest request
    ) {
        return taskService
                .getById(id)
                .map(task -> taskService.update(task, request))
                .map(TaskResponse::new)
                .map(ResponseEntity::ok)
                .orElseThrow(ResourceNotFoundException::new);
    }
}
