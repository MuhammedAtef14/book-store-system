package org.bookstore.bookstore.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "BillingInfos")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class BillingInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer billingInfoID;

    @Column(nullable = false)
    private String cardNumber;

    private LocalDate expirationDate;

    @Column(columnDefinition = "TEXT")
    private String billingAddress;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userID", nullable = false)
    private User user;
}