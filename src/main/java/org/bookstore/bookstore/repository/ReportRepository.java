package org.bookstore.bookstore.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
public class ReportRepository {

    @PersistenceContext
    private EntityManager entityManager;

    // TOTAL SALES FOR PREVIOUS MONTH
    public BigDecimal totalSalesPreviousMonth() {
        return (BigDecimal) entityManager.createNativeQuery(
                """
                        SELECT SUM(oi.Quantity * oi.Price)
                        FROM CustomerOrderItems oi
                        JOIN CustomerOrders o ON oi.CustomerOrderID = o.CustomerOrderID
                        WHERE o.OrderDate >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
                        """
        ).getSingleResult();
    }

    // TOTAL SALES FOR SPECIFIC DATE
    public BigDecimal totalSalesByDate(LocalDate date) {
        return (BigDecimal) entityManager.createNativeQuery(
                        """
                                SELECT SUM(oi.Quantity * oi.Price)
                                FROM CustomerOrderItems oi
                                JOIN CustomerOrders o ON oi.CustomerOrderID = o.CustomerOrderID
                                WHERE DATE(o.OrderDate) = :orderDate
                                """
                ).setParameter("orderDate", date)
                .getSingleResult();
    }

    // TOP 5 CUSTOMERS LAST 3 MONTHS
    public List<Map<String, Object>> top5CustomersLast3Months() {
        List<Object[]> result = entityManager.createNativeQuery(
                """
                        SELECT u.UserID, u.Username, SUM(oi.Quantity * oi.Price) AS total_spent
                        FROM Users u
                        JOIN CustomerOrders o ON u.UserID = o.UserID
                        JOIN CustomerOrderItems oi ON o.CustomerOrderID = oi.CustomerOrderID
                        WHERE o.OrderDate >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
                        GROUP BY u.UserID, u.Username
                        ORDER BY total_spent DESC
                        LIMIT 5
                        """
        ).getResultList();

        return result.stream()
                .map(record -> Map.of(
                        "UserID", record[0],
                        "Username", record[1],
                        "total_spent", record[2]
                ))
                .collect(Collectors.toList());
    }

    // TOP 10 SELLING BOOKS LAST 3 MONTHS
    public List<Map<String, Object>> top10SellingBooksLast3Months() {
        List<Object[]> result = entityManager.createNativeQuery(
                """
                        SELECT b.BookID, b.Title, SUM(oi.Quantity) AS total_sold
                        FROM Books b
                        JOIN CustomerOrderItems oi ON b.BookID = oi.BookID
                        JOIN CustomerOrders o ON oi.CustomerOrderID = o.CustomerOrderID
                        WHERE o.OrderDate >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
                        GROUP BY b.BookID, b.Title
                        ORDER BY total_sold DESC
                        LIMIT 10
                        """
        ).getResultList();

        return result.stream()
                .map(record -> Map.of(
                        "BookID", record[0],
                        "Title", record[1],
                        "total_sold", record[2]
                ))
                .collect(Collectors.toList());
    }
}
