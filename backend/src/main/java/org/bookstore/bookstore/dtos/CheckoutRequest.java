package org.bookstore.bookstore.dtos;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class CheckoutRequest {
    private String cardNumber;
    private String cardHolderName;
    private String expirationDate;
    private String cvv;
}
