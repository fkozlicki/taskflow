package pl.filipkozlicki.taskflow.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ChatRepository extends JpaRepository<Chat, UUID> {
    @Query("SELECT c FROM Chat c JOIN c.users u JOIN c.project p WHERE u.id IN :userIds AND p.id = :projectId")
    Optional<Chat> findByUsersAndProject(@Param("userIds") List<UUID> userIds, @Param("projectId") UUID projectId);
}
