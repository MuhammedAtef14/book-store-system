package org.bookstore.bookstore.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Publishers")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Publisher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer publisherID;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String phone;
}