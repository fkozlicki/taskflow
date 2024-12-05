package pl.filipkozlicki.taskflow.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public List<Notification> getAllByUserId(UUID userId) {
        return notificationRepository.getAllByUserId(userId);
    }

    public Notification send(Notification notification) {
        return notificationRepository.save(notification);
    }
}
