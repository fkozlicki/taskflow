package pl.filipkozlicki.taskflow.project;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.filipkozlicki.taskflow.project.dto.CreateProjectRequest;
import pl.filipkozlicki.taskflow.project.dto.ReorderRequest;
import pl.filipkozlicki.taskflow.task.Task;
import pl.filipkozlicki.taskflow.task.TaskRepository;
import pl.filipkozlicki.taskflow.task.TaskService;
import pl.filipkozlicki.taskflow.user.User;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public Project create(CreateProjectRequest projectRequest, User user) {
        Project project = Project
                .builder()
                .name(projectRequest.getName())
                .owner(user)
                .build();

        return projectRepository.save(project);
    }

    public Optional<Project> getById(String id) {
        return projectRepository.findById(id);
    }

    public List<Project> getAllByUser(User user) {
        return projectRepository.findAllByOwnerId(user.getId());
    }

    public Project update(Project project, UpdateProjectRequest projectRequest) {
        project.setName(projectRequest.getName());

        return projectRepository.save(project);
    }

    public void delete(String id) {
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
