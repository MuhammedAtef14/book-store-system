package org.bookstore.bookstore.repositories;

import org.bookstore.bookstore.entities.EmailVerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailVerificationTokenRepository
        extends JpaRepository<EmailVerificationToken, Integer> {

    @Query(
            value = "SELECT * FROM EmailVerificationTokens WHERE UserID = :userId",
            nativeQuery = true
    )
    Optional<EmailVerificationToken> findByUserId(@Param("userId") Integer userId);


    @Query(
            value = "SELECT * FROM EmailVerificationTokens WHERE Token = :token",
            nativeQuery = true
    )
    Optional<EmailVerificationToken> findByToken(@Param("token") String token);

}
