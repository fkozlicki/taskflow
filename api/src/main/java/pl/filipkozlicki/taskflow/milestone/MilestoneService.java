package pl.filipkozlicki.taskflow.milestone;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.filipkozlicki.taskflow.exception.ResourceNotFoundException;
import pl.filipkozlicki.taskflow.milestone.dto.CreateMilestoneRequest;
import pl.filipkozlicki.taskflow.project.Project;
import pl.filipkozlicki.taskflow.project.ProjectService;

@Service
@RequiredArgsConstructor
public class MilestoneService {
    private final ProjectService projectService;
    private final MilestoneRepository milestoneRepository;

    public Milestone create(CreateMilestoneRequest request) {
        Project project = projectService
                .getById(request.getProjectId())
                .orElseThrow(ResourceNotFoundException::new);

        Milestone milestone = Milestone
                .builder()
                .project(project)
                .content(request.getContent())
                .done(false)
                .build();

        return milestoneRepository.save(milestone);
    }
}
