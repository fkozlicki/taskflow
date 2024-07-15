package pl.filipkozlicki.taskflow.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FieldErrorResource {
    private String code;
    private String detail;
    private String source;
}
