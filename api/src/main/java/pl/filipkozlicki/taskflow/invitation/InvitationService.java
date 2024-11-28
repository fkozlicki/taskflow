package pl.filipkozlicki.taskflow.invitation;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import pl.filipkozlicki.taskflow.project.dto.InviteRequest;
import pl.filipkozlicki.taskflow.project.Project;
import pl.filipkozlicki.taskflow.user.User;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InvitationService {
    private final JavaMailSender mailSender;
    private final InvitationRepository invitationRepository;

    public Optional<Invitation> getByToken(String token) {
        return invitationRepository.findByToken(token);
    }

    public Invitation createInvitation(Project project, InviteRequest inviteRequest, User inviter) {
        String token = RandomStringUtils.randomAlphanumeric(8);

        Invitation invitation = Invitation
                .builder()
                .invitedEmail(inviteRequest.getEmail())
                .status("pending")
                .project(project)
                .token(token)
                .inviter(inviter)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();

        return invitationRepository.save(invitation);
    }

    public void sendInvitationEmail(Invitation invitation, String siteURL)
            throws MessagingException, UnsupportedEncodingException {
        String acceptURL = siteURL + "/projects/join?token=" + invitation.getToken();

        String toAddress = invitation.getInvitedEmail();
        String fromAddress = "filip.kozlickii@gmail.com";
        String senderName = "Taskflow";
        String subject = "Invitation to project";
        String content = String.format("Hi,<br>"
                + "You have been invited by %s to his/her Taskflow project"
                + "Click the link below to accept the invitation:<br>"
                + "<h3><a href=\"%s\" target=\"_self\">ACCEPT</a></h3>"
                + "Thank you,<br>"
                + "Taskflow", invitation.getInviter().getName(), acceptURL);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        helper.setText(content, true);

        mailSender.send(message);
    }
}
