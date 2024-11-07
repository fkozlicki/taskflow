package pl.filipkozlicki.taskflow.project;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Data
public class TasksResponse {
    private List<TaskDTO> todo;
    @JsonProperty("in-review")
    private List<TaskDTO> inReview;
    @JsonProperty("in-progress")
    private List<TaskDTO> inProgress;
    private List<TaskDTO> done;



    public TasksResponse(Project project) {
        Map<String, List<TaskDTO>> groupedTasks = project
                .getTasks()
                .stream()
                .map(TaskDTO::new)
                .collect(Collectors.groupingBy(task -> task.getStatus().toLowerCase()));

        this.todo = groupedTasks.getOrDefault("todo", Collections.emptyList());
        this.inProgress = groupedTasks.getOrDefault("in-progress", Collections.emptyList());
        this.inReview = groupedTasks.getOrDefault("in-review", Collections.emptyList());
        this.done = groupedTasks.getOrDefault("done", Collections.emptyList());
    }
}
