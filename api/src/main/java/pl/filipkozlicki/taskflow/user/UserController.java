package pl.filipkozlicki.taskflow.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.filipkozlicki.taskflow.exception.ResourceNotFoundException;
import pl.filipkozlicki.taskflow.notification.NotificationService;
import pl.filipkozlicki.taskflow.user.dto.UpdateUserRequest;
import pl.filipkozlicki.taskflow.user.dto.UserResponse;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final NotificationService notificationService;

    @PatchMapping("/{id}")
    public ResponseEntity<UserResponse> update(
            @PathVariable UUID id,
            @RequestBody UpdateUserRequest updateUserRequest
    ) {

        return userService
                .getById(id)
                .map(user -> userService.update(user, updateUserRequest))
                .map(UserResponse::new)
                .map(ResponseEntity::ok)
                .orElseThrow(ResourceNotFoundException::new);
    }

    @GetMapping("/{id}/notifications")
    public ResponseEntity<?> getNotifications(@PathVariable UUID id) {
        var a = notificationService.getAllByUserId(id);
        return ResponseEntity.ok(a);
    }
}
