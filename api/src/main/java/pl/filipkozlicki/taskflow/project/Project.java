package pl.filipkozlicki.taskflow.project;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.filipkozlicki.taskflow.task.Task;
import pl.filipkozlicki.taskflow.user.User;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String invitationCode;

    private String description;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @ManyToMany(mappedBy = "projects")
    private Set<User> users = new HashSet<>();

    @OneToMany(mappedBy = "project")
    @OrderBy("position ASC")
    private List<Task> tasks;
}
