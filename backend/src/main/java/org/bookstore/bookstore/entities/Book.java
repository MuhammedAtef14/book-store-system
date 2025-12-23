package org.bookstore.bookstore.entities;


import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.Set;

@Entity
@Table(name = "Books")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bookID;

    @Column(unique = true)
    private String isbn;

    @Column(nullable = false)
    private String title;

    private Integer publicationYear;

    private BigDecimal sellingPrice;

    private String category;

    private Integer numberOfBooks;

    private Integer minimumQuantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publisherID", nullable = false)
    private Publisher publisher;

    @ManyToMany
    @JoinTable(
            name = "bookAuthors",
            joinColumns = @JoinColumn(name = "bookID"),
            inverseJoinColumns = @JoinColumn(name = "authorID")
    )
    private Set<Author> authors;
}