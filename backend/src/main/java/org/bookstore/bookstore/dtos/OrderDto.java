package org.bookstore.bookstore.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class OrderDto {
    private Long orderId;
    private LocalDateTime orderDate;
    private BigDecimal totalPrice;
    private List<BookDto> books;
}
