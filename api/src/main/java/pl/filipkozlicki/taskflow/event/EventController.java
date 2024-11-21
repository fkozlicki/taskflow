package pl.filipkozlicki.taskflow.event;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.filipkozlicki.taskflow.event.dto.CreateEventRequest;
import pl.filipkozlicki.taskflow.event.dto.EventResponse;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;

    @PostMapping
    public ResponseEntity<EventResponse> create(@RequestBody CreateEventRequest request) {
        Event event = eventService.create(request);

        return ResponseEntity.ok(new EventResponse(event));
    }

}
