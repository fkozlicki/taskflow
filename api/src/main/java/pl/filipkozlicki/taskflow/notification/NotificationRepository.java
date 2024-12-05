package pl.filipkozlicki.taskflow.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.filipkozlicki.taskflow.user.User;

import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> user(User user);

    List<Notification> getAllByUserId(UUID userId);
}
