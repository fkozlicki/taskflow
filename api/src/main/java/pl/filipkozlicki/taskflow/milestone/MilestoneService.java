package pl.filipkozlicki.taskflow.milestone;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.filipkozlicki.taskflow.exception.ResourceNotFoundException;
import pl.filipkozlicki.taskflow.milestone.dto.CreateMilestoneRequest;
import pl.filipkozlicki.taskflow.milestone.dto.UpdateMilestoneRequest;
import pl.filipkozlicki.taskflow.project.Project;
import pl.filipkozlicki.taskflow.project.ProjectService;

import java.util.Optional;
import java.util.UUID;

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

    public Optional<Milestone> getById(UUID id) {
        return milestoneRepository
                .findById(id);
    }

    public Milestone update(Milestone milestone, UpdateMilestoneRequest request) {
        milestone.setDone(request.isDone());
        return milestoneRepository.save(milestone);
    }

    public void delete(UUID id) {
        milestoneRepository.deleteById(id);
    }
}
