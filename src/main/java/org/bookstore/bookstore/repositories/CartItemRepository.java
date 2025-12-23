package org.bookstore.bookstore.repositories;

import jakarta.transaction.Transactional;
import org.bookstore.bookstore.entities.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {


    @Modifying
    @Transactional
    @Query(value = """
        INSERT INTO CartItems (cart_id, book_id, quantity)
        VALUES (:cartId, :bookId, :quantity)
        ON DUPLICATE KEY UPDATE
            quantity = quantity + VALUES(quantity)
        """, nativeQuery = true)
    void addToCart(
            @Param("cartId") Long cartId,
            @Param("bookId") Long bookId,
            @Param("quantity") int quantity
    );


    @Modifying
    @Transactional
    @Query(value = """
        UPDATE CartItems
        SET quantity = quantity - 1
        WHERE cart_id = :cartId
        AND book_id = :bookId
        AND quantity > 0
        """, nativeQuery = true)
    void decrementQuantity(
            @Param("cartId") Long cartId,
            @Param("bookId") Long bookId
    );

    @Modifying
    @Transactional
    @Query(value = """
        DELETE FROM CartItems
        WHERE cart_id = :cartId
        AND book_id = :bookId
        AND quantity <= 0
        """, nativeQuery = true)
    void removeIfZero(
            @Param("cartId") Long cartId,
            @Param("bookId") Long bookId
    );

    @Modifying
    @Transactional
    @Query(value = """
        DELETE FROM CartItems
        WHERE cart_id = :cartId
          AND book_id = :bookId
        """, nativeQuery = true)
    void removeFromCart(
            @Param("cartId") Long cartId,
            @Param("bookId") Long bookId
    );


    @Modifying
    @Transactional
    @Query(value = """
        DELETE FROM CartItems
        WHERE cart_id = :cartId
        """, nativeQuery = true)
    void clearCart(@Param("cartId") Long cartId);
}