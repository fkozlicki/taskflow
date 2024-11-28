package pl.filipkozlicki.taskflow.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.filipkozlicki.taskflow.chat.dto.*;
import pl.filipkozlicki.taskflow.exception.ResourceNotFoundException;
import pl.filipkozlicki.taskflow.message.MessageService;
import pl.filipkozlicki.taskflow.user.User;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;
    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<ChatResponse> getOrCreate(
            @AuthenticationPrincipal User user,
            @RequestBody ChatRequest chatRequest
    ) {
        Chat chat = chatService.getOrCreate(chatRequest, user);

        return ResponseEntity.ok(new ChatResponse(chat));
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<PageMessage> page(
            @PathVariable UUID id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime cursor,
            @RequestParam(defaultValue = "10") int limit
    ) {
        if (cursor == null) {
            cursor = LocalDateTime.now();
        }


        return ResponseEntity.ok(chatService.getChatMessages(id, cursor, limit));
    }

    @MessageMapping("/sendMessage/{chatId}")
    @SendTo("/topic/messages/{chatId}")
    public MessageResponse sendMessage(
            @DestinationVariable UUID chatId,
            @Payload MessageRequest message
    ) {
        Chat chat = chatService
                .getById(chatId)
                .orElseThrow(ResourceNotFoundException::new);

        return new MessageResponse(messageService.create(message, chat));
    }
}
