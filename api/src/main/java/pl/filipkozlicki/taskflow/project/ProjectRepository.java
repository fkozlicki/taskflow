package pl.filipkozlicki.taskflow.project;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
    List<Project> findAllByUsersId(UUID userId);
    boolean existsByInvitationCode(String invitationCode);
    Optional<Project> findByInvitationCode(String invitationCode);
}
