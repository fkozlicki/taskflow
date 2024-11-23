package pl.filipkozlicki.taskflow.user;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.filipkozlicki.taskflow.exception.ResourceNotFoundException;
import pl.filipkozlicki.taskflow.security.JWTService;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> createUser(
            @Valid @RequestBody RegisterRequest registerRequest,
            @RequestHeader("Origin") String origin
    ) throws MessagingException, UnsupportedEncodingException {
        User user = userService.createUser(registerRequest);
        userService.sendVerificationEmail(user, origin);

        return ResponseEntity.status(201).body(new HashMap<>() {{
            put("message", "Successfully created user");
        }});
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyUser(@RequestParam("code") String code) {
        boolean result = userService.verify(code);

        if (result) {
            return ResponseEntity.status(200).body("Verified successfully");
        } else {
            return ResponseEntity.status(400).body("Verification failed");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
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
                .secure(false)
                .path("/")
                .maxAge(10080)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(
                UserDTO
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

        return ResponseEntity.ok().body(
                UserDTO
                        .builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .name(user.getName())
                        .build()
        );
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
