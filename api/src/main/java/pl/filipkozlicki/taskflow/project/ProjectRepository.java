package pl.filipkozlicki.taskflow.project;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, String> {
    List<Project> findAllByOwnerId(String ownerId);
    boolean existsByInvitationCode(String invitationCode);
}
