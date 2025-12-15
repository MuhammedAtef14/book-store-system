package org.bookstore.bookstore.entities;

import jakarta.persistence.*;
import lombok.*;

import org.bookstore.bookstore.entities.User;
import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "RefreshTokens")
@Getter
@Setter
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RefreshTokenID")
    private Long refreshTokenId;

    @Column(name = "Token", nullable = false, unique = true)
    private String token;

    @ManyToOne(optional = false)
    @JoinColumn(
            name = "UserID",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_refresh_user")
    )
    private User user;

    @Column(name = "DeviceID")
    private String deviceId;

    @Column(name = "UserAgent", columnDefinition = "TEXT")
    private String userAgent;

    @Column(name = "ExpiryDate", nullable = false)
    private LocalDateTime expiryDate;
}