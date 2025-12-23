package org.bookstore.bookstore.repositories;
import jakarta.transaction.Transactional;
import org.bookstore.bookstore.entities.BillingInfo;
import org.bookstore.bookstore.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BillingInfoRepository
        extends JpaRepository<BillingInfo, Integer> {

    @Transactional
    @Modifying
    @Query(value = """
        INSERT INTO BillingInfos (UserID, CardNumber, CardHolderName, ExpirationDate)
        VALUES (:userId, :cardNumber, :cardHolderName, :expirationDate)
        """, nativeQuery = true)
    void insertBillingInfo(
            @Param("userId") Integer userId,
            @Param("cardNumber") String cardNumber,
            @Param("cardHolderName") String cardHolderName,
            @Param("expirationDate") String expirationDate
    );

    Integer user(User user);
}