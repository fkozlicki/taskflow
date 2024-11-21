package pl.filipkozlicki.taskflow.event;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.filipkozlicki.taskflow.event.dto.CreateEventRequest;
import pl.filipkozlicki.taskflow.exception.ResourceNotFoundException;
import pl.filipkozlicki.taskflow.project.Project;
import pl.filipkozlicki.taskflow.project.ProjectService;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final ProjectService projectService;

    public Event create(CreateEventRequest request) {
        Project project = projectService
                .getById(request.getProjectId())
                .orElseThrow(ResourceNotFoundException::new);

        Event event = Event
                .builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .allDay(request.isAllDay())
                .project(project)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .date(request.getDate())
                .build();

        return eventRepository.save(event);
    }
}
