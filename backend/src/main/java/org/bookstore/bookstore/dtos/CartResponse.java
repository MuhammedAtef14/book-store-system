package org.bookstore.bookstore.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class CartResponse {
    private Long cartId;
    private BigDecimal cartTotal;
    private List<CartItemDto> items;
}
