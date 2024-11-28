package pl.filipkozlicki.taskflow.chat.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class MessageRequest {
    private String content;
    private UUID senderId;
}
