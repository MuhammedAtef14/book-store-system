package org.bookstore.bookstore.dtos;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@AllArgsConstructor
@Getter
@Setter
public class CartItemDto {
    private Long bookId;
    private String bookTitle;
    private int quantity;
    private BigDecimal subTotal;
    private BigDecimal price;
}
