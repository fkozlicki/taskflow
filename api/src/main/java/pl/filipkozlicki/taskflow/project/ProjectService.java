package pl.filipkozlicki.taskflow.project;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.filipkozlicki.taskflow.task.Task;
import pl.filipkozlicki.taskflow.task.TaskRepository;
import pl.filipkozlicki.taskflow.user.User;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;

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
}
