package pl.filipkozlicki.taskflow.task;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.filipkozlicki.taskflow.user.User;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<CreateTaskResponse> create(
            @RequestBody CreateTaskRequest request,
            @AuthenticationPrincipal User user
    ) {
        Task task = taskService.create(request, user);

        return ResponseEntity
                .status(201)
                .body(new CreateTaskResponse(task));
    }
}
