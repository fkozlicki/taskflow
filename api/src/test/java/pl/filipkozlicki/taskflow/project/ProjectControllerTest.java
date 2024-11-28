package pl.filipkozlicki.taskflow.project;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import pl.filipkozlicki.taskflow.invitation.InvitationService;
import pl.filipkozlicki.taskflow.project.dto.CreateProjectRequest;
import pl.filipkozlicki.taskflow.security.JWTService;
import pl.filipkozlicki.taskflow.user.User;
import pl.filipkozlicki.taskflow.user.UserRepository;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProjectController.class)
class ProjectControllerTest {
    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProjectService projectService;

    @MockBean
    private InvitationService invitationService;

    @MockBean
    private JWTService jwtService;

    @MockBean
    private UserDetailsService userDetailsService;

    @MockBean
    private UserRepository userRepository;

    @BeforeEach
    public void setup() {
        UserDetails userDetails = User
                .builder()
                .id(UUID.randomUUID())
                .name("Arianna Grande")
                .email("arianna.grande@gmail.com")
                .password("password")
                .enabled(true)
                .build();

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails,
                userDetails.getPassword()
        );

        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);

        SecurityContextHolder.setContext(securityContext);

        mockMvc = MockMvcBuilders
                .webAppContextSetup(webApplicationContext)
                .build();
    }

    @Test
    public void should_create_project() throws Exception {
        Project savedProject = Project
                .builder()
                .id(UUID.randomUUID())
                .name("Test Project")
                .description("Test Description")
                .build();

        // Mock create
        when(projectService.create(any(CreateProjectRequest.class), any(User.class))).thenReturn(savedProject);

        mockMvc
                .perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                    {
                                        "name": "Test Project",
                                        "description": "Test Description"
                                    }
                                """)
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(savedProject.getId().toString()))
                .andExpect(jsonPath("$.name").value(savedProject.getName()));
    }
}