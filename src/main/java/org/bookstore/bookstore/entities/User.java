package org.bookstore.bookstore.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.bookstore.bookstore.enums.UserRole;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(
        name = "Users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "Email")
        }
)
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserID")
    private Integer userId;

    @Column(name = "Username", nullable = false)
    private String username;

    @Column(name = "Password", nullable = false)
    private String password;

    @Column(name = "FirstName")
    private String firstName;

    @Column(name = "LastName")
    private String lastName;

    @Column(name = "Email", nullable = false, unique = true)
    private String email;

    @Column(name = "Phone")
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "Role", nullable = false)
    private UserRole role;



    @Column(name = "EmailVerified", nullable = false)
    private boolean emailVerified = false;

    @Column(name = "Enabled", nullable = false)
    private boolean enabled = false;


    @Column(name = "CreatedAt", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();


    @OneToMany(mappedBy = "user")
    private List<EmailVerificationToken> emailVerificationTokens;
}
