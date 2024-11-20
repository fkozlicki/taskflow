package pl.filipkozlicki.taskflow.chat;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.filipkozlicki.taskflow.message.Message;
import pl.filipkozlicki.taskflow.project.Project;
import pl.filipkozlicki.taskflow.user.User;

import java.util.List;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @OneToMany(mappedBy = "chat")
    @OrderBy("sentAt desc")
    private List<Message> messages;

    @ManyToMany
    @JoinTable(
            name = "chat_user",
            joinColumns = @JoinColumn(name = "chat_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> users;

}
