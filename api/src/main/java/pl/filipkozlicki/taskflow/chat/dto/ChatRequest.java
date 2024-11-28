package pl.filipkozlicki.taskflow.chat.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class ChatRequest {
    private UUID userId;
    private UUID projectId;
}
