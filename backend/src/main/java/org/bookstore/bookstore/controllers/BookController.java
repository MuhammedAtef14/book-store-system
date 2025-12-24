package org.bookstore.bookstore.controllers;

import org.bookstore.bookstore.entities.Book;
import org.bookstore.bookstore.services.BookService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // GET ALL BOOKS
    @GetMapping("/all")
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    // ADD A NEW BOOK
    @PostMapping("/admin/add")
    public void addBook(@RequestBody Book book) {
        bookService.addBook(book);
    }

    // UPDATE BOOK INFORMATION
    @PutMapping("/admin/update")
    public void updateBook(@RequestBody Book book) {
        bookService.updateBookInfo(book);
    }

    // UPDATE BOOK STOCK
    @PutMapping("/admin/updateStock/{bookId}/{quantity}")
    public void updateStock(@PathVariable Integer bookId, @PathVariable Integer quantity) {
        bookService.updateBookStock(bookId, quantity);
    }

    // SEARCH BOOK BY ISBN
    @GetMapping("/search/isbn/{isbn}")
    public Optional<Book> searchByIsbn(@PathVariable String isbn) {
        return bookService.searchBookByIsbn(isbn);
    }

    // SEARCH BOOK BY TITLE
    @GetMapping("/search/title/{title}")
    public List<Book> searchByTitle(@PathVariable String title) {
        return bookService.searchBooksByTitle(title);
    }

    // SEARCH BOOK BY CATEGORY
    @GetMapping("/search/category/{category}")
    public List<Book> searchByCategory(@PathVariable String category) {
        return bookService.searchBooksByCategory(category);
    }

    // SEARCH BOOK BY AUTHOR
    @GetMapping("/search/author/{author}")
    public List<Book> searchByAuthor(@PathVariable String author) {
        return bookService.searchBooksByAuthor(author);
    }

    // SEARCH BOOK BY PUBLISHER
    @GetMapping("/search/publisher/{publisher}")
    public List<Book> searchByPublisher(@PathVariable String publisher) {
        return bookService.searchBooksByPublisher(publisher);
    }
}
