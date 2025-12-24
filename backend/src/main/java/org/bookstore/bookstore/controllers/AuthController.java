package org.bookstore.bookstore.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.bookstore.bookstore.dtos.*;
import org.bookstore.bookstore.dtos.auth.*;
import org.bookstore.bookstore.services.Authintication.AuthService;
import org.bookstore.bookstore.services.Authintication.JwtService;
import org.bookstore.bookstore.services.Authintication.RefreshTokenService;
import org.bookstore.bookstore.services.CartService;
import org.bookstore.bookstore.services.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/auth")
public class AuthController {
//class
    private final AuthService authService;
    private final CartService cartService;

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String email = auth.getName();
        return ResponseEntity.ok(email);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@Valid  @RequestBody SignUpRequest signUpRequest) {
        authService.signUp(signUpRequest);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        JwtResponse jwtResponse =
                authService.login(loginRequest, request, response);

        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/verify-user")
    public ResponseEntity<?> verifyUser(@RequestBody VerifyUserRequest verifyUserRequest)
    {
        try {
            authService.verifyUser(verifyUserRequest.getToken());
            return ResponseEntity.ok().body("The account is verified");
        }catch(Exception ex){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    "Error: "+ ex.getMessage()
            );
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(
            @CookieValue(name="refreshToken",required = false) String refreshToken ,
            HttpServletRequest request,HttpServletResponse response) {

        JwtResponse jwtResponse=authService.refresh(refreshToken,request,response);
        return  ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/logout")
    @Transactional
    public ResponseEntity<?> logOut(@RequestBody LogOutRequest logOutRequest)
    {
        if(logOutRequest.getUserId()==null)
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("enter the id of the user");
        }
        cartService.clearCart(logOutRequest.getUserId());
        authService.logoutAllDevices(logOutRequest.getUserId());
        return  ResponseEntity.ok().body("logged out succefully");

    }

    @PostMapping("/forgotpassword")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgetPasswordRequest request)
    {
       var resp= authService.sendForgetPasswordOtp(request.getEmail());
        return  ResponseEntity.ok(resp);
    }


    @PostMapping("/checkforgotpassword")
    public  ResponseEntity<?>checkForgotPassword(@Valid @RequestBody ForgetPasswordOtpRequest
                                                 forgetPasswordOtpRequest)
    {
        authService.checkForgetPasswordOtp(forgetPasswordOtpRequest);

        return ResponseEntity.ok().body("Password has changed");

    }



}
