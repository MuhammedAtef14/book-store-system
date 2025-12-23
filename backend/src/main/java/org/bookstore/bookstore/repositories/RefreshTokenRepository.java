package org.bookstore.bookstore.repositories;

import jakarta.transaction.Transactional;
import org.bookstore.bookstore.entities.RefreshToken;
import org.bookstore.bookstore.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    @Query(
            value = "SELECT * FROM RefreshTokens WHERE Token = :token",
            nativeQuery = true
    )
    Optional<RefreshToken> findByToken(@Param("token") String token);


    @Transactional
    @Modifying
    @Query(
            value = "DELETE FROM RefreshTokens WHERE UserID = :userId",
            nativeQuery = true
    )
    void deleteAllByUserId(@Param("userId") Integer userId);


}
