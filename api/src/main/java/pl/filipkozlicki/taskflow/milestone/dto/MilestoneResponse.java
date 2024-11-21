package pl.filipkozlicki.taskflow.milestone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.filipkozlicki.taskflow.milestone.Milestone;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MilestoneResponse {
    private UUID id;
    private String content;
    private boolean done;

    public MilestoneResponse(Milestone milestone) {
        id = milestone.getId();
        content = milestone.getContent();
        done = milestone.isDone();
    }
}
