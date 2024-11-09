package pl.filipkozlicki.taskflow.project.dto;

import lombok.Getter;
import pl.filipkozlicki.taskflow.user.User;

@Getter
public class ProjectMember {
    private String id;
    private String name;
    private String email;

    public ProjectMember(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
    }
}
