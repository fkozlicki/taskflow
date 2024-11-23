package pl.filipkozlicki.taskflow.project;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.filipkozlicki.taskflow.chat.Chat;
import pl.filipkozlicki.taskflow.event.Event;
import pl.filipkozlicki.taskflow.invitation.Invitation;
import pl.filipkozlicki.taskflow.milestone.Milestone;
import pl.filipkozlicki.taskflow.task.Task;
import pl.filipkozlicki.taskflow.user.User;

import java.util.List;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String invitationCode;

    private String description;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @ManyToMany
    @JoinTable(
            name = "project_user",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> users;

    @OneToMany(mappedBy = "project")
    @OrderBy("createdAt ASC")
    private List<Milestone> milestones;

    @OneToMany(mappedBy = "project")
    @OrderBy("position ASC")
    private List<Task> tasks;

    @OneToMany(mappedBy = "project")
    private List<Invitation> invitations;

    @OneToMany(mappedBy = "project")
    private List<Chat> chats;

    @OneToMany(mappedBy = "project")
    private List<Event> events;
}
