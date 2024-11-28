package pl.filipkozlicki.taskflow.project;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;
import pl.filipkozlicki.taskflow.exception.ResourceNotFoundException;
import pl.filipkozlicki.taskflow.invitation.Invitation;
import pl.filipkozlicki.taskflow.invitation.InvitationRepository;
import pl.filipkozlicki.taskflow.invitation.InvitationService;
import pl.filipkozlicki.taskflow.project.dto.CreateProjectRequest;
import pl.filipkozlicki.taskflow.project.dto.ReorderRequest;
import pl.filipkozlicki.taskflow.project.dto.UpdateProjectRequest;
import pl.filipkozlicki.taskflow.task.Task;
import pl.filipkozlicki.taskflow.task.TaskRepository;
import pl.filipkozlicki.taskflow.user.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final InvitationService invitationService;
    private final InvitationRepository invitationRepository;

    public Project joinWithToken(String token, User user) {
        Invitation invitation = invitationService
                .getByToken(token)
                .orElseThrow(ResourceNotFoundException::new);

        Project project = invitation.getProject();

        if (
            !project.getUsers().contains(user) &&
            invitation.getStatus().equals("pending") &&
            invitation.getExpiresAt().isAfter(LocalDateTime.now())
        ) {
            invitation.setStatus("accepted");
            invitationRepository.save(invitation);

            project.getUsers().add(user);
            projectRepository.save(project);

            return project;
        } else {
            return null;
        }
    }

    public Project joinWithCode(String code, User user) {
        Project project = projectRepository
                .findByInvitationCode(code)
                .orElseThrow(ResourceNotFoundException::new);

        if (!project.getUsers().contains(user)) {
            project.getUsers().add(user);
            projectRepository.save(project);

            return project;
        } else {
            return null;
        }
    }

    public Project create(CreateProjectRequest projectRequest, User user) {
        Project project = Project
                .builder()
                .name(projectRequest.getName())
                .description(projectRequest.getDescription())
                .invitationCode(generateUniqueCode())
                .owner(user)
                .users(List.of(user))
                .build();

        return projectRepository.save(project);
    }

    public Optional<Project> getById(UUID id) {
        return projectRepository.findById(id);
    }

    public List<Project> getAllByUser(User user) {
        return projectRepository.findAllByUsersId(user.getId());
    }

    public Project update(Project project, UpdateProjectRequest projectRequest) {
        project.setName(projectRequest.getName());
        project.setDescription(projectRequest.getDescription());

        return projectRepository.save(project);
    }

    public void delete(UUID id) {
        projectRepository.deleteById(id);
    }

    @Transactional
    public void reorderTasks(ReorderRequest reorderRequest) {
        Task task = taskRepository.findById(reorderRequest.getId()).orElseThrow();

        String oldStatus = task.getStatus();
        String newStatus = reorderRequest.getStatus();

        if (oldStatus.equals(newStatus)) {
            reorderWithinSameStatus(task, reorderRequest);
        } else {
            reorderAcrossStatuses(task, reorderRequest);
        }
    }

    public String generateUniqueCode() {
        String code;

        do {
            code = RandomStringUtils.randomAlphanumeric(8);
        } while (projectRepository.existsByInvitationCode(code));

        return code;
    }

    private void reorderWithinSameStatus(Task task, ReorderRequest reorderRequest) {
        String status = task.getStatus();

        int oldPosition = task.getPosition();
        int newPosition = reorderRequest.getPosition();

        if (oldPosition < newPosition) {
            taskRepository.decrementPositions(status, oldPosition, newPosition);
        } else {
            taskRepository.incrementPositions(status, newPosition, oldPosition);
        }

        task.setPosition(newPosition);
        taskRepository.save(task);
    }

    private void reorderAcrossStatuses(Task task, ReorderRequest reorderRequest) {
        String currentStatus = task.getStatus();
        int currentPosition = task.getPosition();

        String newStatus = reorderRequest.getStatus();
        int newPosition = reorderRequest.getPosition();


        taskRepository.decrementPositions(currentStatus, currentPosition + 1, Integer.MAX_VALUE);

        taskRepository.incrementPositions(newStatus, newPosition, Integer.MAX_VALUE);

        task.setStatus(newStatus);
        task.setPosition(newPosition);
        taskRepository.save(task);
    }
}
