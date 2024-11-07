package pl.filipkozlicki.taskflow.task;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.filipkozlicki.taskflow.project.ProjectService;
import pl.filipkozlicki.taskflow.user.User;

import java.util.HashSet;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final ProjectService projectService;

    public Task create(CreateTaskRequest taskRequest, User user) {
        Task newTask = Task
                .builder()
                .name(taskRequest.getName())
                .description(taskRequest.getDescription())
                .status(taskRequest.getStatus())
                .project(projectService.getById(taskRequest.getProjectId()).orElseThrow())
                .dueDate(taskRequest.getDueDate())
                .users(new HashSet<>() {
                    {
                        add(user);
                    }
                })
                .position(taskRequest.getPosition())
                .build();

        return taskRepository.save(newTask);
    }

    public Optional<Task> getById(String id) {
        return taskRepository.findById(id);
    }
}
