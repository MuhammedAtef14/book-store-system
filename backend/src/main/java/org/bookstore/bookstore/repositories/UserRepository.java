package org.bookstore.bookstore.repositories;

import org.bookstore.bookstore.Interfaces.CartItemRow;
import org.bookstore.bookstore.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository  extends JpaRepository<User,Integer> {

    @Query(
            value = "SELECT * FROM Users WHERE Email = :email",
            nativeQuery = true
    )
    Optional<User> findByEmail(@Param("email") String email);


    @Query(
            value = "SELECT * FROM Users WHERE userId = :userId",
            nativeQuery = true
    )
    Optional<User> findByUserId(@Param("userId") Integer userId);


    Optional<User> findByUsername(String username);



    @Query(
           value ="SELECT * FROM Users ",
           nativeQuery = true
    )
    List<User> getAll();

    @Query(
            value = "DELETE FROM Users WHERE userId = :userId",
            nativeQuery = true
    )
    void deleteAllByUserId(@Param("userId") Integer userId);


    @Query(
            value = " UPDATE Users SET Username=: Username , Phone=:Phone , Role=:Role, Password=:password WHERE UserId=userId",
            nativeQuery = true
    )
    Optional<User> update(@Param("userId") Integer userId,String Username,String Phone,String password);


    @Query(
            value = " UPDATE Users SET Password=: Password  WHERE UserId=userId",
            nativeQuery = true
    )
    Optional<User> changePassword(@Param("userId") Integer userId , String Password );


    @Query(
            value = """
        SELECT
            C.cart_id       AS cartId,
            B.BookId        AS bookId,
            B.Title         AS title,
            B.SellingPrice  AS sellingPrice,
            it.quantity     AS quantity
        FROM Carts C
        JOIN CartItems it ON it.cart_id = C.cart_id
        JOIN Books B ON it.book_id = B.BookId
        WHERE C.user_id = :userId
        """,
            nativeQuery = true
    )
    List<CartItemRow> findCartItemsByCartId(
            @Param("userId") Integer userId
    );



    @Query(
            value = """
            SELECT
                U.UserID        AS userID,
                C.cart_id       AS cart_Id,
                B.BookID          AS bookId,
                B.Title         AS title,
                B.Category      AS category,
                B.SellingPrice  AS sellingPrice,
                it.quantity     AS quantity,
                COALESCE(
                    SUM(B.SellingPrice * it.quantity)
                        OVER (PARTITION BY C.cart_id),
                    0
                ) AS cartTotal
            FROM Users U
            LEFT JOIN Carts C
                   ON C.user_id = U.UserID
            LEFT JOIN CartItems it
                   ON it.cart_id = C.cart_id
            LEFT JOIN Books B
                   ON it.book_id = B.BookId
            WHERE U.UserID = :id
              AND C.cart_id = :cartId
            """,
            nativeQuery = true
    )
    List<Object[]> findCartItemsWithTotal(
            @Param("id") Long userId,
            @Param("cartId") Long cartId
    );



    @Query(
            value = """
            SELECT
                U.UserID              AS userID,
                U.Username            AS username,
                co.CustomerOrderID    AS customerOrderID,
                co.OrderDate          AS orderDate,
                co.TotalPrice         AS totalPrice,
                book.ISBN       AS isbn,
                book.Title            AS title
            FROM Users U
            LEFT JOIN CustomerOrders co
                   ON co.UserID = U.UserID
            LEFT JOIN CustomerOrderItems citem
                   ON citem.CustomerOrderID = co.CustomerOrderID
            LEFT JOIN Books book
                   ON citem.BookID = book.BookID
            WHERE U.UserID = :userId
            """,
            nativeQuery = true
    )
    List<Object []> findOrderHistoryByUserId(
            @Param("userId") Long userId
    );
}
