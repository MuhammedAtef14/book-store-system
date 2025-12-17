package org.bookstore.bookstore.repositories;
import org.bookstore.bookstore.entities.BillingInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BillingInfoRepository
        extends JpaRepository<BillingInfo, Integer> {

    @Query("""
        SELECT b FROM BillingInfo b
        WHERE b.user.userID = :userId
          AND b.cardNumber = :card
          AND b.expirationDate >= CURRENT_DATE
    """)
    BillingInfo validateCard(
        @Param("userId") Integer userId,
        @Param("card") String card
    );
}