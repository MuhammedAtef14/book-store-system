package org.bookstore.bookstore.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class OrderHistoryResponse {
    private Long userId;
    private String username;
    private List<OrderDto> orders;
}
