package pl.filipkozlicki.taskflow.user.constraints;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Constraint(validatedBy = DuplicatedEmailValidator.class)
@Retention(RetentionPolicy.RUNTIME)
public @interface DuplicatedEmailConstraint {
    String message() default "Duplicated email";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
