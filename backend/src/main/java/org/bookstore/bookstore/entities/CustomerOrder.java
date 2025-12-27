package org.bookstore.bookstore.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import org.bookstore.bookstore.enums.*;

@Entity
@Table(name = "CustomerOrders")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer customerOrderID;

    @Column(nullable = false)
    private LocalDateTime orderDate = LocalDateTime.now();

    @Column(name = "TotalPrice")
    private BigDecimal totalPrice;


    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", nullable = false)
    private User user;

    @OneToMany(
            mappedBy = "customerOrder",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private Set<CustomerOrderItem> items;
}