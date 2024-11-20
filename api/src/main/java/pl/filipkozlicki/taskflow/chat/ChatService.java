package pl.filipkozlicki.taskflow.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import pl.filipkozlicki.taskflow.exception.ResourceNotFoundException;
import pl.filipkozlicki.taskflow.message.Message;
import pl.filipkozlicki.taskflow.message.MessageRepository;
import pl.filipkozlicki.taskflow.project.Project;
import pl.filipkozlicki.taskflow.project.ProjectService;
import pl.filipkozlicki.taskflow.user.User;
import pl.filipkozlicki.taskflow.user.UserService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatRepository chatRepository;
    private final UserService userService;
    private final ProjectService projectService;
    private final MessageRepository messageRepository;

    public Chat getOrCreate(ChatRequest chatRequest, User user) {
        Project project = projectService
                .getById(chatRequest.getProjectId())
                .orElseThrow(ResourceNotFoundException::new);

        User user2 = userService
                .getById(chatRequest.getUserId())
                .orElseThrow(ResourceNotFoundException::new);

        Optional<Chat> optionalChat = chatRepository
                .findByUsersAndProject(List.of(user.getId(), user2.getId()), project.getId());

        if (optionalChat.isPresent()) {
            return optionalChat.get();
        } else {
            Chat newChat = Chat
                    .builder()
                    .users(List.of(user, user2))
                    .project(project)
                    .build();

            return chatRepository.save(newChat);
        }
    }

    public Optional<Chat> getById(UUID chatId) {
        return chatRepository.findById(chatId);
    }

    public PageMessage getChatMessages(UUID chatId, LocalDateTime cursor, int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("sentAt").descending());
        List<Message> messages = messageRepository.findAllByChatIdWithCursor(chatId, cursor, pageable);
        boolean hasNextPage = messageRepository.existsByChatIdAndSentAtLessThan(chatId, messages.getLast().getSentAt());
        LocalDateTime nextCursor = hasNextPage ? messages.getLast().getSentAt() : null;

        return new PageMessage(
                nextCursor,
                messages.stream().map(MessageResponse::new).toList()
        );
    }

}
