package pl.filipkozlicki.taskflow.event.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateEventRequest {
    private String title;
    private String description;
    private boolean allDay;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private UUID projectId;
    private LocalDate date;

}
