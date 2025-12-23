package org.bookstore.bookstore.entities;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;

@Embeddable
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class CustomerOrderItemId implements Serializable {

    private Integer customerOrderID;
    private Integer bookID;
}