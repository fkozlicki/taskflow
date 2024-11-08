package pl.filipkozlicki.taskflow.project.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReorderRequest {
    private String id;
    private int position;
    private String status;
}
