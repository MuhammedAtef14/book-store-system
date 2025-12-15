package org.bookstore.bookstore.services;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.bookstore.bookstore.dtos.JwtResponse;
import org.bookstore.bookstore.dtos.LoginRequest;
import org.bookstore.bookstore.dtos.SignUpRequest;
import org.bookstore.bookstore.entities.EmailVerificationToken;
import org.bookstore.bookstore.entities.RefreshToken;
import org.bookstore.bookstore.entities.User;
import org.bookstore.bookstore.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;
    private final PasswordEncoder encoder;


    public JwtResponse Login(LoginRequest loginRequest,
                             HttpServletRequest request,
                             HttpServletResponse response)
    {

        var user=userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(()
        -> new RuntimeException("User not found"));

        if(!encoder.matches(loginRequest.getPassword(),user.getPassword()))
           throw  new RuntimeException("Bad Credentials");


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


    private void signUp(SignUpRequest signUpRequest)
    {
           Optional<User> user=userRepository.findByEmail(signUpRequest.getEmail());
           if(user.isPresent())
           {
               throw  new RuntimeException("this email is already registerd ");
           }

           if(!signUpRequest.getPassword().equals(signUpRequest.getPasswordConfirmation()))
           {

               throw  new RuntimeException("the confirmation password does not match the password");
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

          EmailVerificationToken emailVerificationToken=new EmailVerificationToken();

          emailVerificationToken.;






    }


    private void setRefreshCookie(
            HttpServletResponse response,
            String token
    ) {
        Cookie cookie = new Cookie("refreshToken", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/auth/refresh");
        cookie.setMaxAge(3* 60);
        response.addCookie(cookie);
    }


    public void logoutAllDevices(User user) {
        refreshTokenService.logoutAllDevices(user);
    }








}
