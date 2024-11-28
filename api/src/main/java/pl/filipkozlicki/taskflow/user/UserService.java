package pl.filipkozlicki.taskflow.user;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.filipkozlicki.taskflow.auth.dto.RegisterRequest;
import pl.filipkozlicki.taskflow.user.dto.UpdateUserRequest;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;


    public List<User> getUsersByIds(List<UUID> userIds) {
       return userRepository.findAllById(userIds);
    }

    public User create(@Valid RegisterRequest registerRequest) {
        String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());
        String verificationCode = UUID.randomUUID().toString();

        User newUser = User
                .builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(encodedPassword)
                .verificationCode(verificationCode)
                .enabled(false)
                .build();

        return userRepository.save(newUser);
    }


    public User update(User user, UpdateUserRequest updateRequest) {

        if (updateRequest.getName() != null) {

            user.setName(updateRequest.getName());
        }

        if (updateRequest.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(updateRequest.getPassword()));
        }

        if (updateRequest.getVerificationCode() != null) {
            user.setVerificationCode(updateRequest.getVerificationCode());
        }

        if (updateRequest.getEnabled() != null) {
            user.setEnabled(updateRequest.getEnabled());
        }

        return userRepository.save(user);
    }

    public Optional<User> getByCode(String code) {
        return userRepository.findByVerificationCode(code);
    }

    public Optional<User> getByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> getById(UUID id) {
        return userRepository.findById(id);
    }

    public void sendVerificationEmail(User user, String siteURL)
            throws MessagingException, UnsupportedEncodingException {
        String verifyURL = siteURL + "/verify?code=" + user.getVerificationCode();

        String toAddress = user.getEmail();
        String fromAddress = "filip.kozlickii@gmail.com";
        String senderName = "Taskflow";
        String subject = "Please verify your registration";
        String content = String.format("Dear %s,<br>"
                + "Please click the link below to verify your registration:<br>"
                + "<h3><a href=\"%s\" target=\"_self\">VERIFY</a></h3>"
                + "Thank you,<br>"
                + "Taskflow", user.getName(), verifyURL);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        helper.setText(content, true);

        mailSender.send(message);
    }
}
