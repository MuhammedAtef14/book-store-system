package org.bookstore.bookstore.services.Authintication;

import lombok.AllArgsConstructor;
import org.bookstore.bookstore.entities.EmailVerificationToken;
import org.bookstore.bookstore.entities.User;
import org.bookstore.bookstore.repositories.EmailVerificationTokenRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@AllArgsConstructor
public class VerificationService {

    private final EmailVerificationTokenRepository emailVerificationTokenRepository;

    private static final SecureRandom random = new SecureRandom();

    private EmailVerificationToken createEmailVerificationToken(User user)
    {
        EmailVerificationToken emailVerificationToken=new EmailVerificationToken();
        emailVerificationToken.setToken(generate6DigitCode());
        //send notification in the email
        emailVerificationToken.setExpiryDate(LocalDateTime.now().plusMinutes(1));
        emailVerificationToken.setUser(user);
        emailVerificationTokenRepository.save(emailVerificationToken);
        return  emailVerificationToken;

    }

    public String generate6DigitCode() {
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    public void save(EmailVerificationToken emailVerificationToken)
    {

        emailVerificationTokenRepository.save(emailVerificationToken);
    }

    Optional<EmailVerificationToken> findByUseId(Integer userId){
        return emailVerificationTokenRepository.findByUserId(userId);
    }

    Optional<EmailVerificationToken> findByToken(String token){
        return emailVerificationTokenRepository.findByToken(token);
    }

    public void delete(EmailVerificationToken emailVerificationToken)
    {
        emailVerificationTokenRepository.delete(emailVerificationToken);
    }

}
