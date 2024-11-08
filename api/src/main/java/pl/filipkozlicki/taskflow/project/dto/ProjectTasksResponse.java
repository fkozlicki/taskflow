package pl.filipkozlicki.taskflow.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import pl.filipkozlicki.taskflow.project.Project;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Data
public class ProjectTasksResponse {
    private List<ProjectTaskDTO> todo;
    @JsonProperty("in-review")
    private List<ProjectTaskDTO> inReview;
    @JsonProperty("in-progress")
    private List<ProjectTaskDTO> inProgress;
    private List<ProjectTaskDTO> done;



    public ProjectTasksResponse(Project project) {
        Map<String, List<ProjectTaskDTO>> groupedTasks = project
                .getTasks()
                .stream()
                .map(ProjectTaskDTO::new)
                .collect(Collectors.groupingBy(task -> task.getStatus().toLowerCase()));

        this.todo = groupedTasks.getOrDefault("todo", Collections.emptyList());
        this.inProgress = groupedTasks.getOrDefault("in-progress", Collections.emptyList());
        this.inReview = groupedTasks.getOrDefault("in-review", Collections.emptyList());
        this.done = groupedTasks.getOrDefault("done", Collections.emptyList());
    }
}
