package pl.filipkozlicki.taskflow.user;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public User createUser(@Valid RegisterRequest registerRequest, String siteURL)
            throws UnsupportedEncodingException, MessagingException {
        String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());
        String verificationCode = UUID.randomUUID().toString();

        User existingUser = userRepository
                .findByEmail(registerRequest.getEmail())
                .orElse(null);

        User newUser;

        if (existingUser != null && !existingUser.isEnabled()) {
            existingUser.setName(registerRequest.getName());
            existingUser.setPassword(encodedPassword);
            existingUser.setVerificationCode(verificationCode);

            newUser = existingUser;
        } else {
            newUser = User
                    .builder()
                    .name(registerRequest.getName())
                    .email(registerRequest.getEmail())
                    .password(encodedPassword)
                    .verificationCode(verificationCode)
                    .enabled(false)
                    .build();
        }

        sendVerificationEmail(newUser, siteURL);

        return userRepository.save(newUser);
    }

    public User update(User user, UpdateUserRequest updateRequest) {

        return userRepository.save(user);
    }

    public boolean verify(String code) {
        User user = userRepository
                .findByVerificationCode(code)
                .orElse(null);

        if (user == null || user.isEnabled()) {
            return false;
        } else {
            user.setVerificationCode(null);
            user.setEnabled(true);
            userRepository.save(user);

            return true;
        }
    }

    public Optional<User> getByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    private void sendVerificationEmail(User user, String siteURL)
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
