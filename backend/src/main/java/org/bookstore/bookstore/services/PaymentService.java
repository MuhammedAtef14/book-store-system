package org.bookstore.bookstore.services;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.bookstore.bookstore.dtos.CheckoutRequest;
import org.bookstore.bookstore.entities.BillingInfo;
import org.bookstore.bookstore.exceptions.BusinessException;
import org.bookstore.bookstore.repositories.BillingInfoRepository;
import org.bookstore.bookstore.repositories.UserRepository;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Getter
@Setter
@Service
public class PaymentService {

    private final BillingInfoRepository  billingInfoRepository;
    private final UserRepository userRepository;

    public boolean validCredintials(Integer user_id, CheckoutRequest credit_card) {
        if (credit_card.getCardNumber() == null || credit_card.getCardNumber().length() != 16) {
            throw new BusinessException("Invalid card number");
        }

        if (credit_card.getCardHolderName() == null || credit_card.getCardHolderName().isBlank()) {
            throw new BusinessException("Invalid card holder name");
        }

        if (credit_card.getExpirationDate() == null ||
                !credit_card.getExpirationDate().matches("(0[1-9]|1[0-2])/\\d{2}")) {
            throw new BusinessException("Invalid expiration date");
        }

        if (credit_card.getCvv() == null || !credit_card.getCvv().matches("\\d{3}")) {
            throw new BusinessException("Invalid CVV");
        }

        String date = parseDate(credit_card.getExpirationDate());
        billingInfoRepository.insertBillingInfo(user_id, credit_card.getCardNumber(), credit_card.getCardHolderName(), date);

        return true;
    }

    private String parseDate(String date) {
        if(date == null){
            throw new BusinessException("Date is invalid");
        }

        String parts[] = date.split("/");
        if (parts.length == 2) {
            String month = parts[0];
            String year = parts[1];
            return "20" + year + "-" + month + "-01";
        }

        throw new BusinessException("Date format is invalid");
    }

}
