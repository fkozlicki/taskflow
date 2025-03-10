package pl.filipkozlicki.taskflow.auth.dto;

import com.fasterxml.jackson.annotation.JsonRootName;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import pl.filipkozlicki.taskflow.user.constraints.DuplicatedEmailConstraint;

@Getter
@JsonRootName("user")
@Data
@AllArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email")
    @DuplicatedEmailConstraint
    private String email;
    @NotBlank(message = "Name is required")
    private String name;
    @NotBlank(message = "Password is required")
    private String password;
}
