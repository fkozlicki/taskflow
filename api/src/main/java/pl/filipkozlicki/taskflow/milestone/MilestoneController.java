package pl.filipkozlicki.taskflow.milestone;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.filipkozlicki.taskflow.milestone.dto.CreateMilestoneRequest;
import pl.filipkozlicki.taskflow.milestone.dto.MilestoneResponse;

@RestController
@RequestMapping("/api/milestones")
@RequiredArgsConstructor
public class MilestoneController {
    private final MilestoneService milestoneService;

    @PostMapping
    public ResponseEntity<MilestoneResponse> create(@RequestBody CreateMilestoneRequest request) {
        Milestone milestone = milestoneService.create(request);

        return ResponseEntity.ok(new MilestoneResponse(milestone));
    }
}
