package pl.filipkozlicki.taskflow.seed;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import pl.filipkozlicki.taskflow.user.User;
import pl.filipkozlicki.taskflow.user.UserRepository;

@Component
@Configuration
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private final String PASSWORD = passwordEncoder.encode("secret");

    public void run(String... args) throws Exception {
        userRepository.save(User
                .builder()
                .name("John Doe")
                .email("johndoe@gmail.com")
                .password(PASSWORD)
                .enabled(true)
                .build()
        );
    }
}
