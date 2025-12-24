package org.bookstore.bookstore.services.Authintication;

import lombok.AllArgsConstructor;
import org.bookstore.bookstore.entities.ForgetPasswordToken;
import org.bookstore.bookstore.exceptions.BusinessException;
import org.bookstore.bookstore.repositories.ForgetPasswordTokensRepository;
import org.bookstore.bookstore.services.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ForgetPasswordService {

    private final UserService userService;
    private final ForgetPasswordTokensRepository forgetPasswordTokensRepository;
    public ForgetPasswordToken createFromEmail(String email,String OTP){

        var forgetPasswordToken= new ForgetPasswordToken();
        forgetPasswordToken.setOtp(OTP);
        forgetPasswordToken.setExpiryDate(LocalDateTime.now().plusMinutes(5));

        var user= userService.findByEmail(email).orElseThrow(()
                ->new BusinessException("User is not in db "));
       // forgetPasswordToken.setUser(user);
        forgetPasswordToken.setEmail(email);

        return  forgetPasswordToken;

    }

    public Optional<ForgetPasswordToken> findByEmail(String email){
        return forgetPasswordTokensRepository.findByToken(email);
    }

    public void  save(ForgetPasswordToken forgetPasswordToken){
        forgetPasswordTokensRepository.save(forgetPasswordToken);
    }

    public void delete(ForgetPasswordToken forgetPasswordToken)
    {
        forgetPasswordTokensRepository.deleteAllByEmail(forgetPasswordToken.getEmail());
    }
}
