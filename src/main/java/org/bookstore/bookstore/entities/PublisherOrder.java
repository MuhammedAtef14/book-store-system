package org.bookstore.bookstore.entities;

import jakarta.persistence.*;
import lombok.*;
import  org.bookstore.bookstore.enums.*;

@Entity
@Table(name = "PublisherOrders")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class PublisherOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer publisherOrderID;

    private Integer quantity;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bookID", nullable = false)
    private Book book;
}