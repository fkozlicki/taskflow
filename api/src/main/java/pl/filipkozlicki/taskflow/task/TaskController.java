package pl.filipkozlicki.taskflow.task;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import pl.filipkozlicki.taskflow.exception.ResourceNotFoundException;
import pl.filipkozlicki.taskflow.user.User;
import pl.filipkozlicki.taskflow.user.UserService;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<CreateTaskResponse> create(
            @RequestBody CreateTaskRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService
                .getByEmail(userDetails.getUsername())
                .orElseThrow(ResourceNotFoundException::new);

        Task task = taskService.create(request, user);

        return ResponseEntity
                .status(201)
                .body(new CreateTaskResponse(task));
    }
}
