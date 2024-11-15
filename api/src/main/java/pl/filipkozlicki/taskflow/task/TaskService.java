package pl.filipkozlicki.taskflow.task;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.filipkozlicki.taskflow.project.ProjectService;
import pl.filipkozlicki.taskflow.user.User;
import pl.filipkozlicki.taskflow.user.UserService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final ProjectService projectService;
    private final UserService userService;

    public Task create(CreateTaskRequest taskRequest, User user) {
        List<User> users = userService.getUsersByIds(taskRequest.getUsers());

        Task newTask = Task
                .builder()
                .name(taskRequest.getName())
                .description(taskRequest.getDescription())
                .status(taskRequest.getStatus())
                .project(projectService.getById(taskRequest.getProjectId()).orElseThrow())
                .dueDate(taskRequest.getDueDate())
                .users(users)
                .position(taskRequest.getPosition())
                .build();

        return taskRepository.save(newTask);
    }

    public Optional<Task> getById(String id) {
        return taskRepository.findById(id);
    }
}
