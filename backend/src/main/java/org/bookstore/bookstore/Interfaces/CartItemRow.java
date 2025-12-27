package org.bookstore.bookstore.Interfaces;

import java.math.BigDecimal;

public interface CartItemRow {

    Long getCartId();

    Long getBookId();

    String getTitle();

    BigDecimal getSellingPrice();

    Integer getQuantity();
}
