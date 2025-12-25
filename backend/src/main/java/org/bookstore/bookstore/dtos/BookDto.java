package org.bookstore.bookstore.dtos;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class BookDto {
    private String isbn;
    private String title;
}
