import { api } from './api';

export const bookService = {
  async searchBooks(searchParams) {
    const params = new URLSearchParams(searchParams);
    const response = await api.request(`/books/search?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to search books');
    }
    
    return await response.json();
  },

  async getBookById(bookId) {
    const response = await api.request(`/books/${bookId}`);
    
    if (!response.ok) {
      throw new Error('Book not found');
    }
    
    return await response.json();
  },

  async getAllBooks() {
    const response = await api.request('/books');
    
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    
    return await response.json();
  },

  // Admin only
  async addBook(bookData) {
    const response = await api.request('/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add book');
    }
    
    return await response.json();
  },

  async updateBook(bookId, bookData) {
    const response = await api.request(`/books/${bookId}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update book');
    }
    
    return await response.json();
  },

  async deleteBook(bookId) {
    const response = await api.request(`/books/${bookId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete book');
    }
  }
};