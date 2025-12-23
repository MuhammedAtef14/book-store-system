package org.bookstore.bookstore.repositories;

import jakarta.transaction.Transactional;
import org.bookstore.bookstore.entities.CustomerOrder;
import org.bookstore.bookstore.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Optional;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Integer> {

    @Query(value = """
        SELECT CustomerOrderID
        FROM CustomerOrders
        WHERE CustomerOrderID = :orderId
        """, nativeQuery = true)
    Integer findOrderById(@Param("orderId") Integer orderId);

    @Transactional
    @Modifying
    @Query(value = """
        INSERT INTO CustomerOrders (UserID, TotalPrice, Status, OrderDate)
        VALUES (:userId, :totalPrice, :status, :orderDate)
        """, nativeQuery = true)
    void insertCustomerOrder(
            @Param("userId") Integer userId,
            @Param("totalPrice") BigDecimal totalPrice,
            @Param("status") String status,
            @Param("orderDate") java.sql.Timestamp orderDate
    );


    @Query(value = "SELECT LAST_INSERT_ID()", nativeQuery = true)
    Integer getLastInsertedOrderId();


    @Query(value = """
        SELECT *
        FROM CustomerOrders
        WHERE UserID = :userId
        ORDER BY OrderDate DESC
        """, nativeQuery = true)
    Optional<CustomerOrder> findLatestOrderByUserId(@Param("userId") Integer userId);


    @Transactional
    @Modifying
    @Query(value = """
        UPDATE CustomerOrders
        SET Status = :status
        WHERE CustomerOrderID = :orderId
        """, nativeQuery = true)
    void updateOrderStatus(
            @Param("orderId") Integer orderId,
            @Param("status") String status
    );

    Integer user(User user);
}