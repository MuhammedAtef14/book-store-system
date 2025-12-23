package org.bookstore.bookstore.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "EmailVerificationTokens")
@Getter
@Setter
public class EmailVerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TokenID")
    private Integer tokenId;

    @Column(name = "Token", nullable = false, unique = true)
    private String token;

    @ManyToOne(optional = false)
    @JoinColumn(
            name = "UserID",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_email_verification_user")
    )
    private User user;

    @Column(name = "ExpiryDate", nullable = false)
    private LocalDateTime expiryDate;
}
