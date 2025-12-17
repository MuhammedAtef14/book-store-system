package org.bookstore.bookstore.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "ForgetPasswordTokens")
@Getter
@Setter
@NoArgsConstructor
public class ForgetPasswordToken {

    @Id
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "OTP")
    private String otp;

    @Column(name = "expiryDate")
    private LocalDateTime expiryDate;



}
