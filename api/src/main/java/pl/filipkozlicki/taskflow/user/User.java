package pl.filipkozlicki.taskflow.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.filipkozlicki.taskflow.project.Project;
import pl.filipkozlicki.taskflow.task.Task;

import java.util.HashSet;
import java.util.Set;

@Entity(name = "_user")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    private String verificationCode;


    @Column(nullable = false)
    private boolean enabled;

    @ManyToMany
    @JoinTable(
            name = "project_user",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "project_id")
    )
    private Set<Project> projects = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "task_user",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "task_id")
    )
    private Set<Task> tasks;
}
