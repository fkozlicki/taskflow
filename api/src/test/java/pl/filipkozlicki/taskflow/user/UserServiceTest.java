//package pl.filipkozlicki.taskflow.user;
//
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import pl.filipkozlicki.taskflow.auth.dto.RegisterRequest;
//
//import java.util.UUID;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.junit.jupiter.api.Assertions.assertFalse;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.when;
//
//class UserServiceTest {
//
//    @InjectMocks
//    private UserService userService;
//
//    @Mock
//    private UserRepository userRepository;
//
//    @Mock
//    private PasswordEncoder passwordEncoder;
//
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    @Test
//    public void should_successfully_create_user() {
//        // Given
//        RegisterRequest registerRequest = new RegisterRequest(
//                "john.doe@example.com",
//                "John Doe",
//                "verysecret"
//        );
//
//        String encodedPassword = "encodedPassword";
//        String verificationCode = "verificationCode";
//        User savedUser = User
//                .builder()
//                .id(UUID.randomUUID())
//                .name("John Doe")
//                .email("john.doe@example.com")
//                .password(encodedPassword)
//                .verificationCode(verificationCode)
//                .enabled(false)
//                .build();
//
//        // Mock the calls
//        when(passwordEncoder.encode("verysecret")).thenReturn(encodedPassword);
//        when(userRepository.save(any(User.class))).thenReturn(savedUser);
//
//        // When
//        User result = userService.create(registerRequest);
//
//        // Then
//        assertEquals(result.getName(), registerRequest.getName());
//        assertEquals(result.getEmail(), registerRequest.getEmail());
//        assertFalse(result.isEnabled());
//
//    }
//}