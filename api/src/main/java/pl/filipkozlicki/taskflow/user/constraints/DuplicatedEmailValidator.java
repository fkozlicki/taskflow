package pl.filipkozlicki.taskflow.user.constraints;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import pl.filipkozlicki.taskflow.user.User;
import pl.filipkozlicki.taskflow.user.UserRepository;

import java.util.Optional;

@RequiredArgsConstructor
public class DuplicatedEmailValidator implements ConstraintValidator<DuplicatedEmailConstraint, String> {
    private final UserRepository userRepository;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext constraintValidatorContext) {
        Optional<User> user = userRepository.findByEmail(value);
        return user.isEmpty() || !user.get().isEnabled();
    }
}
