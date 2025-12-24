package org.bookstore.bookstore.services;

import org.bookstore.bookstore.entities.Book;
import org.bookstore.bookstore.repositories.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    // GET ALL BOOKS
    public List<Book> getAllBooks() {
        return bookRepository.getAllBooks();
    }

    // ADD A NEW BOOK
    public void addBook(Book book) {
        bookRepository.insertBook(
                book.getIsbn(),
                book.getTitle(),
                book.getPublicationYear(),
                book.getSellingPrice(),
                book.getCategory(),
                book.getNumberOfBooks(),
                book.getMinimumQuantity(),
                book.getPublisher().getPublisherID()
        );
    }

    // UPDATE BOOK INFORMATION
    public void updateBookInfo(Book book) {
        bookRepository.updateBookInfo(
                book.getBookID(),
                book.getTitle(),
                book.getPublicationYear(),
                book.getSellingPrice(),
                book.getCategory()
        );
    }

    // UPDATE BOOK STOCK
    public void updateBookStock(Integer bookId, Integer newQuantity) {
        bookRepository.updateBookQuantity(bookId, newQuantity);
    }

    // SEARCH BOOK BY ISBN
    public Optional<Book> searchBookByIsbn(String isbn) {
        return bookRepository.findByIsbn(isbn);
    }

    // SEARCH BOOK BY TITLE
    public List<Book> searchBooksByTitle(String title) {
        return bookRepository.findByTitle(title);
    }

    // SEARCH BOOK BY CATEGORY
    public List<Book> searchBooksByCategory(String category) {
        return bookRepository.findByCategory(category);
    }

    // SEARCH BOOK BY AUTHOR
    public List<Book> searchBooksByAuthor(String author) {
        return bookRepository.findByAuthor(author);
    }

    // SEARCH BOOK BY PUBLISHER
    public List<Book> searchBooksByPublisher(String publisher) {
        return bookRepository.findByPublisher(publisher);
    }
}
