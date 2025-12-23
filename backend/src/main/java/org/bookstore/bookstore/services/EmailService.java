package org.bookstore.bookstore.services;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import lombok.Setter;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import  org.bookstore.bookstore.entities.Message;
@AllArgsConstructor
@Service
public class EmailService {
    private final JavaMailSender mailSender;
      //note that this service needs dependencies i downloaded int th pom file
    @Async
    public void sendEmail(String to, Message message) {
        MimeMessage msg = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(msg, true);
            helper.setTo(to);
            helper.setSubject(message.getSubject());
            helper.setText(message.getBody(), false);
            mailSender.send(msg);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }

    }
}
