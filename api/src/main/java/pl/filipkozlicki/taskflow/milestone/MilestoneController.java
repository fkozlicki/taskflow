package pl.filipkozlicki.taskflow.milestone;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.filipkozlicki.taskflow.exception.ResourceNotFoundException;
import pl.filipkozlicki.taskflow.milestone.dto.CreateMilestoneRequest;
import pl.filipkozlicki.taskflow.milestone.dto.MilestoneResponse;
import pl.filipkozlicki.taskflow.milestone.dto.UpdateMilestoneRequest;

import java.util.UUID;

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

    @PatchMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable UUID id,
            @RequestBody UpdateMilestoneRequest request
            ) {
        return milestoneService
                .getById(id)
                .map(milestone -> ResponseEntity.ok(
                        new MilestoneResponse(milestoneService.update(milestone, request))
                ))
                .orElseThrow(ResourceNotFoundException::new);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        return milestoneService
                .getById(id)
                .map(milestone -> {
                    milestoneService.delete(milestone.getId());
                    return ResponseEntity.noContent().build();
                })
                .orElseThrow(ResourceNotFoundException::new);
    }
}
