package org.bookstore.bookstore.repositories;

import org.bookstore.bookstore.entities.PublisherOrder;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public interface PublisherOrderRepository extends JpaRepository<PublisherOrder, Integer> {
    // INSERT A NEW PUBLISHER ORDER
    @Modifying
    @Query(value = """
                INSERT INTO PublisherOrders (Quantity, Status, BookID)
                VALUES (:qty, 'PENDING', :bookId)
            """, nativeQuery = true)
    void placePublisherOrder(
            @Param("bookId") Integer bookId,
            @Param("qty") Integer quantity
    );

    // CONFIRM A PUBLISHER ORDER
    @Modifying
    @Query(value = """
                UPDATE PublisherOrders
                SET Status = 'COMPLETED'
                WHERE PublisherOrderID = :orderId
            """, nativeQuery = true)
    void confirmPublisherOrder(@Param("orderId") Integer orderId);

    // DELETE A PUBLISHER ORDER
    @Modifying
    @Query(value = """
                DELETE FROM PublisherOrders
                WHERE PublisherOrderID = :orderId
            """, nativeQuery = true)
    void deletePublisherOrder(@Param("orderId") Integer orderId);

    // FIND ALL ORDERS FOR A SPECIFIC BOOK
    @Query(value = """
                SELECT * FROM PublisherOrders
                WHERE BookID = :bookId
            """, nativeQuery = true)
    List<PublisherOrder> findOrdersByBook(@Param("bookId") Integer bookId);

    // FIND PENDING ORDERS
    @Query(value = """
                SELECT * FROM PublisherOrders
                WHERE Status = 'PENDING'
            """, nativeQuery = true)
    List<PublisherOrder> findPendingOrders();

    // FIND COMPLETED ORDERS
    @Query(value = """
                SELECT * FROM PublisherOrders
                WHERE Status = 'COMPLETED'
            """, nativeQuery = true)
    List<PublisherOrder> findCompletedOrders();

    // COUNT HOW MANY TIMES A BOOK WAS ORDERED
    @Query(value = """
                SELECT COUNT(*)
                FROM PublisherOrders
                WHERE BookID = :bookId
            """, nativeQuery = true)
    int countOrdersForBook(@Param("bookId") Integer bookId);
}
