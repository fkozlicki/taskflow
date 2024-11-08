package pl.filipkozlicki.taskflow.project;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import pl.filipkozlicki.taskflow.exception.ResourceNotFoundException;
import pl.filipkozlicki.taskflow.project.dto.*;
import pl.filipkozlicki.taskflow.user.User;
import pl.filipkozlicki.taskflow.user.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;
    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> get(@PathVariable String id) {
        return projectService
                .getById(id)
                .map(ProjectResponse::new)
                .map(ResponseEntity::ok)
                .orElseThrow(ResourceNotFoundException::new);
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAll(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService
                .getByEmail(userDetails.getUsername())
                .orElseThrow(ResourceNotFoundException::new);

        List<ProjectResponse> projects = projectService
                .getAllByUser(user)
                .stream()
                .map(ProjectResponse::new)
                .toList();

        return ResponseEntity.ok(projects);
    }

    @PostMapping
    public ResponseEntity<CreateProjectResponse> create(
            @RequestBody CreateProjectRequest projectRequest,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService
                .getByEmail(userDetails.getUsername())
                .orElseThrow(ResourceNotFoundException::new);

        Project project = projectService.create(projectRequest, user);

        return ResponseEntity
                .status(201)
                .body(new CreateProjectResponse(project));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable String id,
            @RequestBody UpdateProjectRequest projectRequest
    ) {
        return projectService
                .getById(id)
                .map(project -> ResponseEntity.ok(
                        projectService.update(project, projectRequest)
                ))
                .orElseThrow(ResourceNotFoundException::new);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        return projectService
                .getById(id)
                .map(project -> {
                    projectService.delete(project.getId());
                    return ResponseEntity.noContent().build();
                })
                .orElseThrow(ResourceNotFoundException::new);
    }

    @GetMapping("/{id}/tasks")
    public ResponseEntity<?> tasks(@PathVariable String id) {
        return projectService
                .getById(id)
                .map(ProjectTasksResponse::new)
                .map(ResponseEntity::ok)
                .orElseThrow(ResourceNotFoundException::new);
    }

    @PatchMapping("/{id}/tasks/reorder")
    public ResponseEntity<?> updateTask(
            @PathVariable String id,
            @RequestBody ReorderRequest reorderRequest
    ) {
        projectService.reorderTasks(reorderRequest);

        return projectService
                .getById(id)
                .map(ProjectTasksResponse::new)
                .map(ResponseEntity::ok)
                .orElseThrow(ResourceNotFoundException::new);
    }
}
