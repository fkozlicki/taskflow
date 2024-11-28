package pl.filipkozlicki.taskflow.chat.dto;

import lombok.Data;
import pl.filipkozlicki.taskflow.message.Message;
import pl.filipkozlicki.taskflow.user.dto.UserResponse;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class MessageResponse {
    private UUID id;
    private String content;
    private UserResponse sender;
    private LocalDateTime sentAt;

    public MessageResponse(Message message) {
        this.id = message.getId();
        this.content = message.getContent();
        this.sender = new UserResponse(message.getSender());
        this.sentAt = message.getSentAt();
    }
}
