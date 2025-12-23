package org.bookstore.bookstore.repositories;

import org.bookstore.bookstore.entities.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public interface BookRepository extends JpaRepository<Book, Integer> {
    // GET ALL BOOKS
    @Query(value = "SELECT * FROM Books", nativeQuery = true)
    List<Book> getAllBooks();

    // ADD NEW BOOK (Admin)
    @Modifying
    @Query(value = """
                INSERT INTO Books
                (ISBN, Title, PublicationYear, SellingPrice, Category,
                 NumberOfBooks, MinimumQuantity, PublisherID)
                VALUES (:isbn, :title, :year, :price, :category,
                        :stock, :minQty, :publisherId)
            """, nativeQuery = true)
    void insertBook(
            @Param("isbn") String isbn,
            @Param("title") String title,
            @Param("year") Integer publicationYear,
            @Param("price") BigDecimal sellingPrice,
            @Param("category") String category,
            @Param("stock") Integer numberOfBooks,
            @Param("minQty") Integer minimumQuantity,
            @Param("publisherId") Integer publisherId
    );

    // UPDATE BOOK INFO (Admin)
    @Modifying
    @Query(value = """
                UPDATE Books
                SET Title = :title,
                    PublicationYear = :year,
                    SellingPrice = :price,
                    Category = :category
                WHERE BookID = :bookId
            """, nativeQuery = true)
    void updateBookInfo(
            @Param("bookId") Integer bookId,
            @Param("title") String title,
            @Param("year") Integer publicationYear,
            @Param("price") BigDecimal sellingPrice,
            @Param("category") String category
    );

    // UPDATE BOOK QUANTITY
    @Modifying
    @Query(value = """
                UPDATE Books
                SET NumberOfBooks = :quantity
                WHERE BookID = :bookId
            """, nativeQuery = true)
    void updateBookQuantity(
            @Param("bookId") Integer bookId,
            @Param("quantity") Integer quantity
    );

    // SEARCH BY ISBN (Admin + Customer)
    @Query(value = "SELECT * FROM Books WHERE ISBN = :isbn", nativeQuery = true)
    Optional<Book> findByIsbn(@Param("isbn") String isbn);

    // SEARCH BY TITLE (Admin + Customer)
    @Query(value = """
                SELECT * FROM Books
                WHERE Title LIKE %:title%
            """, nativeQuery = true)
    List<Book> findByTitle(@Param("title") String title);

    // SEARCH BY CATEGORY (Admin + Customer)
    @Query(value = """
                SELECT * FROM Books
                WHERE Category = :category
            """, nativeQuery = true)
    List<Book> findByCategory(@Param("category") String category);

    // SEARCH BY AUTHOR (Admin + Customer)
    @Query(value = """
                SELECT DISTINCT b.*
                FROM Books b
                JOIN BookAuthors ba ON b.BookID = ba.BookID
                JOIN Authors a ON a.AuthorID = ba.AuthorID
                WHERE a.Name LIKE %:author%
            """, nativeQuery = true)
    List<Book> findByAuthor(@Param("author") String authorName);

    // SEARCH BY PUBLISHER (Admin + Customer)
    @Query(value = """
                SELECT b.*
                FROM Books b
                JOIN Publishers p ON b.PublisherID = p.PublisherID
                WHERE p.Name LIKE %:publisher%
            """, nativeQuery = true)
    List<Book> findByPublisher(@Param("publisher") String publisherName);


}
