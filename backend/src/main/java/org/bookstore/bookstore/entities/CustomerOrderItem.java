package org.bookstore.bookstore.entities;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "CustomerOrderItems")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerOrderItem {

    @EmbeddedId
    private CustomerOrderItemId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("customerOrderID")
    @JoinColumn(name = "customerOrderID")
    private CustomerOrder customerOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("bookID")
    @JoinColumn(name = "bookID")
    private Book book;

    private Integer quantity;

    private BigDecimal price;
}