package org.bookstore.bookstore.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LogOutRequest {

    private Integer userId;
}
