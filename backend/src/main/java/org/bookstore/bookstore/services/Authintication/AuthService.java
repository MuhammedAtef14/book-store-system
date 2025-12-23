package org.bookstore.bookstore.services.Authintication;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.bookstore.bookstore.dtos.*;
import org.bookstore.bookstore.dtos.auth.ForgetPasswordOtpRequest;
import org.bookstore.bookstore.dtos.auth.ForgetPasswordResponse;
import org.bookstore.bookstore.dtos.auth.JwtResponse;
import org.bookstore.bookstore.dtos.auth.LoginRequest;
import org.bookstore.bookstore.entities.*;
import org.bookstore.bookstore.exceptions.BusinessException;
import org.bookstore.bookstore.services.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class AuthService {
    private final UserService userService;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;
    private final PasswordEncoder encoder;
    private final VerificationService verificationService;
    private final EmailService emailService;
    private final ForgetPasswordService forgetPasswordService;



    public JwtResponse login(LoginRequest loginRequest,
                             HttpServletRequest request,
                             HttpServletResponse response)
    {

        var user=userService.findByEmail(loginRequest.getEmail()).orElseThrow(()
        -> new BusinessException("User not found"));

        if(!user.isEnabled() || !user.isEmailVerified())
        {
            throw new BusinessException("the email has not been verified yet");
        }

        if(!encoder.matches(loginRequest.getPassword(),user.getPassword()))
           throw  new BusinessException("Bad Credentials");


        //creating the access token and the refresh token

        String accessToken =jwtService.generateAccessToken(user.getEmail());

        //i recommend eyad moaad send it
        String deviceId =
                UUID.randomUUID().toString(); // frontend can also send this
        String userAgent=request.getHeader("User-Agent");

        RefreshToken rt =
                refreshTokenService.create(user, deviceId, userAgent);

        setRefreshCookie(response, rt.getToken());

        return new JwtResponse(accessToken);


    }

    @Transactional
    public JwtResponse refresh(
            String refreshToken, HttpServletRequest request,HttpServletResponse response
    ){
        //validate if the
       RefreshToken rt=refreshTokenService.isValid(refreshToken);

       String newAccessToken= jwtService.generateAccessToken(rt.getUser().getEmail());
       RefreshToken newRefreshToken=refreshTokenService.create(rt.getUser(), UUID.randomUUID().toString(),request.getHeader("User-Agent"));

       setRefreshCookie(response,newRefreshToken.getToken());

       refreshTokenService.delete(rt);

       return new JwtResponse(newAccessToken);

    }

    @Transactional
    public void signUp(SignUpRequest signUpRequest)
    {
           Optional<User> user=userService.findByEmail(signUpRequest.getEmail());
           if(user.isPresent())
           {
               throw  new BusinessException("this email is already registerd ");
           }

           if(!signUpRequest.getPassword().equals(signUpRequest.getPasswordConfirmation()))
           {

               throw  new BusinessException("the confirmation password does not match the password");
           }


          User newUser = new User();

          newUser.setEmail(signUpRequest.getEmail());
          newUser.setRole(signUpRequest.getUserRole());
          newUser.setCreatedAt(LocalDateTime.now());
          newUser.setPhone(signUpRequest.getPhone());
          newUser.setPassword(encoder.encode(signUpRequest.getPassword()));
          newUser.setEmailVerified(false);
          newUser.setUsername(signUpRequest.getUsername());
          newUser.setFirstName(signUpRequest.getFirstName());
          newUser.setLastName(signUpRequest.getLastName());

          userService.save(newUser);

          var emailVarToken=createEmailVerificationToken(newUser);

          emailService.sendEmail(signUpRequest.getEmail(),new Message(emailVarToken.getToken(),"Sign up verification "));


          //return new SignUpResponse(newUser.getUserId());
         //send email




    }



    @Transactional
    public void  verifyUser(String token)
    {
       var emailVerToken = verificationService.findByToken(token).orElseThrow(()-> new RuntimeException("the token entered is wrong")
      );

      if(emailVerToken.getExpiryDate().isBefore(LocalDateTime.now()))
      {
          throw new RuntimeException("the verification token has been expired");
      }


      User user = emailVerToken.getUser();


      user.setEmailVerified(true);
      user.setEnabled(true);

      verificationService.delete(emailVerToken);

    }

    @Transactional
    public ForgetPasswordResponse sendForgetPasswordOtp(String email)
    {
        String otp=verificationService.generate6DigitCode();

        var forgetPassword= forgetPasswordService.createFromEmail(email,otp);

        forgetPasswordService.save(forgetPassword);


        emailService.sendEmail(email,new Message(otp,"Forget password otp"));
        return new ForgetPasswordResponse(otp,email);
    }




    public void  checkForgetPasswordOtp(ForgetPasswordOtpRequest forgetPasswordOtpRequest)
    {
        var tokenEntity= forgetPasswordService.findByEmail(forgetPasswordOtpRequest.getEmail()).orElseThrow(
                ()-> new BusinessException("no Passwoed forget used for this user")
        );

        if(tokenEntity.getExpiryDate().isBefore(LocalDateTime.now()))
        {
            forgetPasswordService.delete(tokenEntity);
            throw new BusinessException("this token is expired");
        }

       if(!forgetPasswordOtpRequest.getOTP().equals(tokenEntity.getOtp())) {
           forgetPasswordService.delete(tokenEntity);
           throw new BusinessException("the token you entered is wrong");
       }



       var user =userService.findByEmail(forgetPasswordOtpRequest.getEmail()).orElseThrow(
               ()-> new BusinessException("the user has not registered the system")
       );

       user.setPassword(encoder.encode(forgetPasswordOtpRequest
               .getNewPassword()));

       forgetPasswordService.delete(tokenEntity);



       userService.save(user);
    }





    public EmailVerificationToken createEmailVerificationToken(User user)
    {
        EmailVerificationToken emailVerificationToken=new EmailVerificationToken();
        emailVerificationToken.setToken(verificationService.generate6DigitCode());
        emailVerificationToken.setExpiryDate(LocalDateTime.now().plusMinutes(10));
        emailVerificationToken.setUser(user);
        verificationService.save(emailVerificationToken);
        return  emailVerificationToken;

    }





    private void setRefreshCookie(
            HttpServletResponse response,
            String token
    ) {
        Cookie cookie = new Cookie("refreshToken", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/auth/refresh");
        cookie.setMaxAge(15* 60);
        response.addCookie(cookie);
    }


    public void logoutAllDevices(Integer userId) {
        refreshTokenService.logoutAllDevices(userId);
    }











}
