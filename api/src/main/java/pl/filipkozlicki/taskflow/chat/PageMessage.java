package pl.filipkozlicki.taskflow.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageMessage {
    private LocalDateTime nextCursor;
    private List<MessageResponse> messages;
}
