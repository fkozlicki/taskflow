package pl.filipkozlicki.taskflow.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import pl.filipkozlicki.taskflow.user.User;
import pl.filipkozlicki.taskflow.user.UserRepository;
import pl.filipkozlicki.taskflow.user.UserService;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private final JWTService jwtService;
    private final GithubOAuthService githubService;
    private final OAuth2AuthorizedClientService authorizedClientService;
    private final UserService userService;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {
        OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) authentication;
        String email = authToken.getPrincipal().getAttribute("email");

        OAuth2AuthorizedClient authorizedClient =
                authorizedClientService.loadAuthorizedClient(
                        authToken.getAuthorizedClientRegistrationId(),
                        authToken.getName()
                );

        if (email == null) {
            email = githubService.getPrimaryEmail(authorizedClient.getAccessToken().getTokenValue());
        }

        User existingUser = userService.getByEmail(email).orElse(null);
        User user;

        if (existingUser == null) {
            String name = authToken.getPrincipal().getAttribute("name");

            User newUser = User
                    .builder()
                    .name(name)
                    .enabled(true)
                    .email(email)
                    .build();

            user = userRepository.save(newUser);

        } else {
            user = existingUser;
        }


        String token = jwtService.generateToken(user);

        Cookie jwtCookie = new Cookie("accessToken", token);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(3600); // 1 hour
        response.addCookie(jwtCookie);

        response.sendRedirect("http://localhost:5173/dashboard");
    }
}