package pl.filipkozlicki.taskflow.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.filipkozlicki.taskflow.chat.Chat;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatResponse {
    private UUID id;
    private String name;

    public ChatResponse(Chat chat) {
        this.id = chat.getId();
        this.name = chat.getName();
    }
}
