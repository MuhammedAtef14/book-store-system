package org.bookstore.bookstore.dtos.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ForgetPasswordResponse {
    String forgetPasswordOtp;
    String email;
}
