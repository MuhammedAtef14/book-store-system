package org.bookstore.bookstore.repositories;

import org.bookstore.bookstore.entities.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart,Long> {

    // 1. Rename method to findByUserId to avoid conflict with standard findById
    // 2. Use exact DB table name 'Carts' and column 'UserId' (case-sensitive in some DBs)
    @Query(value = "SELECT * FROM Carts c WHERE c.UserId = :userId", nativeQuery = true)
    Optional<Cart> findByUserId(@Param("userId") Integer userId);




}

