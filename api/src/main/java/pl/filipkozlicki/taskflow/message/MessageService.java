package pl.filipkozlicki.taskflow.message;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.filipkozlicki.taskflow.chat.Chat;
import pl.filipkozlicki.taskflow.chat.dto.MessageRequest;
import pl.filipkozlicki.taskflow.exception.ResourceNotFoundException;
import pl.filipkozlicki.taskflow.user.User;
import pl.filipkozlicki.taskflow.user.UserService;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserService userService;

    public Message create(MessageRequest message, Chat chat) {
        User sender = userService
                .getById(message.getSenderId())
                .orElseThrow(ResourceNotFoundException::new);

        return messageRepository.save(
                Message
                        .builder()
                        .chat(chat)
                        .sender(sender)
                        .content(message.getContent())
                        .build()
        );
    }
}
