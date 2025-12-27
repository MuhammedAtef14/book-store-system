package org.bookstore.bookstore.repositories;

import jakarta.transaction.Transactional;
import org.bookstore.bookstore.entities.ForgetPasswordToken;
import org.bookstore.bookstore.entities.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ForgetPasswordTokensRepository extends JpaRepository<ForgetPasswordToken,String> {

    @Query(
            value = "SELECT * FROM ForgetPasswordTokens WHERE email = :email",
            nativeQuery = true
    )
    Optional<ForgetPasswordToken> findByToken(@Param("email") String email);

    @Transactional
    @Modifying
    @Query(
            value = "DELETE FROM ForgetPasswordTokens WHERE email = :email",
            nativeQuery = true
    )
    void deleteAllByEmail(@Param("email") String email);
}
