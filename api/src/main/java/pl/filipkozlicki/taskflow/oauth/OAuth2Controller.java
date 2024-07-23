package pl.filipkozlicki.taskflow.oauth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequiredArgsConstructor
public class OAuth2Controller {
    private final OAuth2AuthorizedClientService clientService;

    @GetMapping("/login/oauth2/code/{provider}")
    public RedirectView loginSuccess(@PathVariable("provider") String provider, OAuth2AuthenticationToken token, @RequestHeader("Origin") String origin) {
        OAuth2AuthorizedClient client = clientService.loadAuthorizedClient(
                token.getAuthorizedClientRegistrationId(),
                token.getName()
        );

        String name = client.getPrincipalName();

        System.out.println("EMAIL: " + name);

        return new RedirectView(origin + "/dashboard");
    }
}
