package pl.filipkozlicki.taskflow.chat;

import lombok.Data;
import pl.filipkozlicki.taskflow.message.Message;
import pl.filipkozlicki.taskflow.user.UserDTO;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class MessageResponse {
    private UUID id;
    private String content;
    private UserDTO sender;
    private LocalDateTime sentAt;

    public MessageResponse(Message message) {
        this.id = message.getId();
        this.content = message.getContent();
        this.sender = new UserDTO(message.getSender());
        this.sentAt = message.getSentAt();
    }
}
