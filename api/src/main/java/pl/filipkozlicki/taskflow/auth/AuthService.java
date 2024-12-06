package pl.filipkozlicki.taskflow.auth;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import pl.filipkozlicki.taskflow.auth.dto.LoginRequest;
import pl.filipkozlicki.taskflow.auth.dto.RegisterRequest;
import pl.filipkozlicki.taskflow.exception.ResourceNotFoundException;
import pl.filipkozlicki.taskflow.security.JWTService;
import pl.filipkozlicki.taskflow.user.*;
import pl.filipkozlicki.taskflow.user.dto.UpdateUserRequest;

import java.io.UnsupportedEncodingException;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JWTService jwtService;
    private final JavaMailSender mailSender;
    @Value("${application.jwt-expiration}")
    private int jwtExpiration;

    public User register(@Valid RegisterRequest registerRequest) {
        User existingUser = userService.getByEmail(registerRequest.getEmail()).orElse(null);

        if (existingUser == null) {
            return userService.create(registerRequest);
        } else {
            return userService.update(
                    existingUser,
                    UpdateUserRequest
                            .builder()
                            .name(registerRequest.getName())
                            .password(registerRequest.getPassword())
                            .build()
            );
        }
    }

    public User login(LoginRequest loginRequest, HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        User user = userService
                .getByEmail(loginRequest.getEmail())
                .orElseThrow(ResourceNotFoundException::new);

        String accessToken = jwtService.generateToken(user);

        ResponseCookie cookie = ResponseCookie.from("accessToken", accessToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(jwtExpiration)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return user;
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

    public boolean verify(String code) {
        User user = userService
                .getByCode(code)
                .orElse(null);

        if (user == null || user.isEnabled()) {
            return false;
        } else {
            userService.update(
                    user,
                    UpdateUserRequest
                            .builder()
                            .verificationCode(null)
                            .enabled(true)
                            .build()
            );

            return true;
        }
    }



}
