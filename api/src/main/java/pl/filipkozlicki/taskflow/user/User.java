package pl.filipkozlicki.taskflow.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import pl.filipkozlicki.taskflow.invitation.Invitation;
import pl.filipkozlicki.taskflow.project.Project;
import pl.filipkozlicki.taskflow.task.Task;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity(name = "_user")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    private String verificationCode;

    @Column(nullable = false)
    private boolean enabled;

    @ManyToMany(mappedBy = "users")
    private List<Project> projects;

    @ManyToMany(mappedBy = "users")
    private List<Task> tasks;

    @OneToMany(mappedBy = "inviter")
    private List<Invitation> invitations;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
