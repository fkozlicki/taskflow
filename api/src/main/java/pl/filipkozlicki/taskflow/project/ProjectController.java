package pl.filipkozlicki.taskflow.project;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.filipkozlicki.taskflow.event.dto.EventResponse;
import pl.filipkozlicki.taskflow.exception.ResourceNotFoundException;
import pl.filipkozlicki.taskflow.invitation.InvitationService;
import pl.filipkozlicki.taskflow.milestone.dto.MilestoneResponse;
import pl.filipkozlicki.taskflow.project.dto.*;
import pl.filipkozlicki.taskflow.user.User;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;
    private final InvitationService invitationService;

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> get(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        return projectService
                .getById(id)
                .map(project -> new ProjectResponse(project, project.getOwner().getEmail().equals(user.getEmail())))
                .map(ResponseEntity::ok)
                .orElseThrow(ResourceNotFoundException::new);
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAll(@AuthenticationPrincipal User user) {
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
            @AuthenticationPrincipal User user
    ) {
        Project project = projectService.create(projectRequest, user);

        return ResponseEntity
                .status(201)
                .body(new CreateProjectResponse(project));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable UUID id,
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
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        return projectService
                .getById(id)
                .map(project -> {
                    projectService.delete(project.getId());
                    return ResponseEntity.noContent().build();
                })
                .orElseThrow(ResourceNotFoundException::new);
    }

    @GetMapping("/{id}/milestones")
    public ResponseEntity<List<MilestoneResponse>> getMilestones(@PathVariable UUID id) {
        return projectService
                .getById(id)
                .map(project -> project.getMilestones().stream().map(MilestoneResponse::new).toList())
                .map(ResponseEntity::ok)
                .orElseThrow(ResourceNotFoundException::new);
    }

    @GetMapping("/{id}/tasks")
    public ResponseEntity<?> tasks(@PathVariable UUID id) {
        return projectService
                .getById(id)
                .map(ProjectTasksResponse::new)
                .map(ResponseEntity::ok)
                .orElseThrow(ResourceNotFoundException::new);
    }

    @GetMapping("/{id}/events")
    public ResponseEntity<?> events(@PathVariable UUID id) {
        return projectService
                .getById(id)
                .map(Project::getEvents)
                .map(events -> events
                        .stream()
                        .map(EventResponse::new)
                        .collect(Collectors.groupingBy(event -> event.getDate().toString()))
                )
                .map(ResponseEntity::ok)
                .orElseThrow(ResourceNotFoundException::new);
    }

    @PatchMapping("/{id}/tasks/reorder")
    public ResponseEntity<?> updateTask(
            @PathVariable UUID id,
            @RequestBody ReorderRequest reorderRequest
    ) {
        projectService.reorderTasks(reorderRequest);

        return projectService
                .getById(id)
                .map(ProjectTasksResponse::new)
                .map(ResponseEntity::ok)
                .orElseThrow(ResourceNotFoundException::new);
    }

    @PostMapping("/{id}/invite")
    public ResponseEntity<?> inviteToProject(
            @PathVariable("id") UUID projectId,
            @RequestBody InviteRequest inviteRequest,
            @AuthenticationPrincipal User user,
            @RequestHeader("Origin") String origin
    ) throws MessagingException, UnsupportedEncodingException {

        Project project = projectService
                .getById(projectId)
                .orElseThrow(ResourceNotFoundException::new);

        var invitation = invitationService.createInvitation(project, inviteRequest, user);

        invitationService.sendInvitationEmail(invitation, origin);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinProject(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String token,
            @AuthenticationPrincipal User user
    ) {
        Project project = null;

        if (code != null) {
            project = projectService.joinWithCode(code, user);
        }
        if (token != null) {
            project = projectService.joinWithToken(token, user);
        }


        if (project != null) {
            projectService.sendJoinNotification(user, project);

            return ResponseEntity.ok(new ProjectResponse(project));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid project code or user is already a member.");
        }
    }
}
