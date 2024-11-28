package pl.filipkozlicki.taskflow.auth;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.filipkozlicki.taskflow.auth.dto.LoginRequest;
import pl.filipkozlicki.taskflow.auth.dto.RegisterRequest;
import pl.filipkozlicki.taskflow.user.User;
import pl.filipkozlicki.taskflow.user.dto.UserResponse;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest registerRequest,
            @RequestHeader("Origin") String origin
    ) throws MessagingException, UnsupportedEncodingException {
        User user = authService.register(registerRequest);
        authService.sendVerificationEmail(user, origin);

        return ResponseEntity.status(201).body(new HashMap<>() {{
            put("message", "Successfully created user");
        }});
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verify(@RequestParam("code") String code) {
        boolean result = authService.verify(code);

        if (result) {
            return ResponseEntity.status(200).body("Verified successfully");
        } else {
            return ResponseEntity.status(400).body("Verification failed");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(
            @RequestBody LoginRequest loginRequest,
            HttpServletResponse response
    ) {
        User user = authService.login(loginRequest, response);

        return ResponseEntity.ok(UserResponse
                .builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build()
        );
    }

    @GetMapping("/session")
    public ResponseEntity<?> session(@AuthenticationPrincipal User user) {
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.OK);
        }

        return ResponseEntity.ok().body(new UserResponse(user));
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.status(200).body("Logged out successfully");
    }
}
