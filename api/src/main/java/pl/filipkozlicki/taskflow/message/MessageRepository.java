package pl.filipkozlicki.taskflow.message;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {
    @Query("SELECT m FROM Message m JOIN m.chat c WHERE c.id = :chatId AND m.sentAt < :cursor ORDER BY m.sentAt DESC")
    List<Message> findAllByChatIdWithCursor(@Param("chatId") UUID chatId, @Param("cursor") LocalDateTime cursor, Pageable pageable);

    boolean existsByChatIdAndSentAtLessThan(UUID chatId, LocalDateTime sentAt);
}
