package pl.filipkozlicki.taskflow.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import pl.filipkozlicki.taskflow.config.SecurityConfig;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

@ExtendWith(SpringExtension.class)
@WebMvcTest(UserController.class)
@ContextConfiguration(classes = {SecurityConfig.class})
@WebAppConfiguration
class UserControllerTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private UserService userService;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }


    @BeforeEach
    void setUp() {
    }

    @Test
    void should_successfully_create_user() throws Exception {
        // Given
        RegisterRequest registerRequest = new RegisterRequest(
                "john.doe@example.com",
                "John Doe",
                "verysecret"
        );
        String origin = "http://localhost:3000";

        User user = User
                .builder()
                .id(UUID.randomUUID())
                .name("John Doe")
                .email("john.doe@example.com")
                .enabled(false)
                .build();

        // Mock the calls
        when(userService.createUser(any(RegisterRequest.class))).thenReturn(user);
        doNothing().when(userService).sendVerificationEmail(any(User.class), eq(origin));

        mockMvc
                .perform(MockMvcRequestBuilders.post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Origin", origin)
                        .content("""
                                {
                                  "email": "john.doe@example.com",
                                  "name": "John Doe",
                                  "password": "verysecret"
                                }
                                """)
                )
                .andDo(MockMvcResultHandlers.log())
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("Successfully created user"));

        verify(userService, times(1)).createUser(any(RegisterRequest.class));
        verify(userService, times(1)).sendVerificationEmail(any(User.class), eq(origin));
    }
}