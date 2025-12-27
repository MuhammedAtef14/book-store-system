package org.bookstore.bookstore.dtos;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.bookstore.bookstore.enums.UserRole;

@Getter
@Setter
@AllArgsConstructor
public class UserDto {


    private Integer userId;

    @Size(min = 3, max = 30, message = "Username must be 3–30 characters")
    @Pattern(
            regexp = "^[a-zA-Z0-9_]+$",
            message = "Username can contain letters, numbers, and underscores only"
    )
    private String username;


    private UserRole userRole;



    @Size(min = 8, max = 64, message = "Password must be 8–64 characters")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).+$",
            message = "Password must contain uppercase, lowercase, number, and special character"
    )
    private String password;



    private String passwordConfirmation;



    @Size(min = 2, max = 50, message = "First name must be 2–50 characters")
    @Pattern(
            regexp = "^[A-Za-z]+$",
            message = "First name must contain letters only"
    )
    private String firstName;



    @Size(min = 2, max = 50, message = "Last name must be 2–50 characters")
    @Pattern(
            regexp = "^[A-Za-z]+$",
            message = "Last name must contain letters only"
    )
    private String lastName;



    @Email(message = "Invalid email format")
    private String email;



    @Pattern(
            regexp = "^(?:\\+20|20|0)(1[0125])[0-9]{8}$",
            message = "Phone number must be 10–15 digits and may start with +"
    )
    private String phone;

}
