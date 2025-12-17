package org.bookstore.bookstore.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.bookstore.bookstore.dtos.*;
import org.bookstore.bookstore.services.AuthService;
import org.bookstore.bookstore.services.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.function.EntityResponse;

@RestController
@AllArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;


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

    @PostMapping("/log-out")
    public ResponseEntity<?> logOut(@RequestBody LogOutRequest logOutRequest)
    {
        authService.logoutAllDevices(logOutRequest.getUserId());
        return  ResponseEntity.ok().body("logged out succefully");

    }

}
