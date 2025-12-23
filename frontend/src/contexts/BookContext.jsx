import React, { createContext, useState, useCallback } from 'react';
import { bookService } from '../services/bookService';

export const BookContext = createContext(null);

export function BookProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    author: '',
    publisher: '',
    title: '',
    isbn: '',
  });

  // Fetch all books
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await bookService.getAllBooks();
      setBooks(data);
      return data;
    } catch (error) {
      console.error('Failed to fetch books:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Search books with filters
  const searchBooks = async (searchParams) => {
    setLoading(true);
    try {
      const data = await bookService.searchBooks(searchParams);
      setSearchResults(data);
      return data;
    } catch (error) {
      console.error('Failed to search books:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get single book by ID
  const getBookById = async (bookId) => {
    setLoading(true);
    try {
      const data = await bookService.getBookById(bookId);
      setSelectedBook(data);
      return data;
    } catch (error) {
      console.error('Failed to fetch book:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Add new book (Admin only)
  const addBook = async (bookData) => {
    try {
      const newBook = await bookService.addBook(bookData);
      setBooks(prev => [...prev, newBook]);
      return newBook;
    } catch (error) {
      console.error('Failed to add book:', error);
      throw error;
    }
  };

  // Update book (Admin only)
  const updateBook = async (bookId, bookData) => {
    try {
      const updatedBook = await bookService.updateBook(bookId, bookData);
      setBooks(prev => prev.map(book => 
        book.bookID === bookId ? updatedBook : book
      ));
      if (selectedBook?.bookID === bookId) {
        setSelectedBook(updatedBook);
      }
      return updatedBook;
    } catch (error) {
      console.error('Failed to update book:', error);
      throw error;
    }
  };

  // Delete book (Admin only)
  const deleteBook = async (bookId) => {
    try {
      await bookService.deleteBook(bookId);
      setBooks(prev => prev.filter(book => book.bookID !== bookId));
      if (selectedBook?.bookID === bookId) {
        setSelectedBook(null);
      }
    } catch (error) {
      console.error('Failed to delete book:', error);
      throw error;
    }
  };

  // Filter books locally
  const filterBooks = useCallback((filterCriteria) => {
    setFilters(filterCriteria);
    
    let filtered = [...books];

    if (filterCriteria.category) {
      filtered = filtered.filter(book => 
        book.category === filterCriteria.category
      );
    }

    if (filterCriteria.title) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(filterCriteria.title.toLowerCase())
      );
    }

    if (filterCriteria.isbn) {
      filtered = filtered.filter(book =>
        book.isbn?.includes(filterCriteria.isbn)
      );
    }

    if (filterCriteria.author) {
      filtered = filtered.filter(book =>
        book.authors?.some(author =>
          author.name.toLowerCase().includes(filterCriteria.author.toLowerCase())
        )
      );
    }

    if (filterCriteria.publisher) {
      filtered = filtered.filter(book =>
        book.publisher?.name.toLowerCase().includes(filterCriteria.publisher.toLowerCase())
      );
    }

    return filtered;
  }, [books]);

  // Clear filters
  const clearFilters = () => {
    setFilters({
      category: '',
      author: '',
      publisher: '',
      title: '',
      isbn: '',
    });
    setSearchResults([]);
  };

  // Get books by category
  const getBooksByCategory = useCallback((category) => {
    return books.filter(book => book.category === category);
  }, [books]);

  // Get featured/new books
  const getFeaturedBooks = useCallback(() => {
    // Return most recent books (you can adjust logic)
    return [...books]
      .sort((a, b) => b.publicationYear - a.publicationYear)
      .slice(0, 8);
  }, [books]);

  const value = {
    books,
    loading,
    selectedBook,
    searchResults,
    filters,
    fetchBooks,
    searchBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
    filterBooks,
    clearFilters,
    getBooksByCategory,
    getFeaturedBooks,
    setSelectedBook,
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
}