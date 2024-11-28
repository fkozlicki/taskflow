package pl.filipkozlicki.taskflow.security;

import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class GithubOAuthService {
    private final RestTemplate restTemplate = new RestTemplate();

    public String getPrimaryEmail(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        HttpEntity<String> request = new HttpEntity<>(headers);

        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                "https://api.github.com/user/emails",
                HttpMethod.GET,
                request,
                new ParameterizedTypeReference<>() {
                }
        );

        List<Map<String, Object>> emails = response.getBody();


        if (emails != null) {
            for (Map<String, Object> emailInfo : emails) {
                if (Boolean.TRUE.equals(emailInfo.get("primary")) && Boolean.TRUE.equals(emailInfo.get("verified"))) {
                    return (String) emailInfo.get("email");
                }
            }
        }

        throw new IllegalStateException("No primary email found for GitHub user");
    }
}
