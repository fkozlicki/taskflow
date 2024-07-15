package pl.filipkozlicki.taskflow.exception;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY;

@RestControllerAdvice
public class CustomizeExceptionHandler extends ResponseEntityExceptionHandler {

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {

        List<FieldErrorResource> errorModels = processErrors(ex);
        return ResponseEntity
                .status(UNPROCESSABLE_ENTITY)
                .body(ErrorsResponse
                        .builder()
                        .errors(errorModels)
                        .build()
                );
    }

    private List<FieldErrorResource> processErrors(MethodArgumentNotValidException e) {
        List<FieldErrorResource> validationErrors = new ArrayList<>();

        for (FieldError fieldError : e.getBindingResult().getFieldErrors()) {
            FieldErrorResource validationErrorModel = FieldErrorResource
                    .builder()
                    .code(fieldError.getCode())
                    .source(fieldError.getObjectName() + "/" + fieldError.getField())
                    .detail(fieldError.getDefaultMessage())
                    .build();
            validationErrors.add(validationErrorModel);
        }

        return validationErrors;
    }
}
