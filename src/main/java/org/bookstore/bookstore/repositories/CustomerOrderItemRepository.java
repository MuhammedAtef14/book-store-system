package org.bookstore.bookstore.repositories;

import jakarta.transaction.Transactional;
import org.bookstore.bookstore.entities.CustomerOrderItem;
import org.bookstore.bookstore.entities.CustomerOrderItemId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerOrderItemRepository extends JpaRepository<CustomerOrderItem, CustomerOrderItemId> {

    @Transactional
    @Modifying
    @Query(value = """
        INSERT INTO CustomerOrderItems
            (CustomerOrderID, BookID, Quantity, Price, TotalPrice)
        SELECT
            :orderId,
            b.BookID,
            ci.Quantity,
            b.SellingPrice,
            ci.Quantity * b.SellingPrice
        FROM CartItems ci
        JOIN Books b ON ci.book_id = b.BookID
        WHERE ci.cart_id = :cartId
        """, nativeQuery = true)
    void insertOrderItemsFromCart(
            @Param("orderId") Integer orderId,
            @Param("cartId") Long cartId
    );


    @Query(value = """
        SELECT *
        FROM CustomerOrderItems
        WHERE CustomerOrderID = :orderId
        """, nativeQuery = true)
    List<CustomerOrderItem> findByOrderId(@Param("orderId") Integer orderId);

    @Transactional
    @Modifying
    @Query(value = """
        DELETE FROM CustomerOrderItems
        WHERE CustomerOrderID = :orderId
        """, nativeQuery = true)
    void deleteByOrderId(@Param("orderId") Integer orderId);

}