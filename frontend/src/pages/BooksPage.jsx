import React, { useState, useEffect } from 'react';
import { apiCall } from '../api/api';
import { ShoppingCart, Search, Edit, Trash2, Plus, Package } from 'lucide-react';
import AddBookModal from '../components/AddBookModal';
import EditBookModal from '../components/EditBookModal';

const BooksPage = ({ isAdmin }) => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const userId = JSON.parse(localStorage.getItem('user'))?.userId || 1;

  useEffect(() => {
    loadAllBooks();
  }, []);

  const loadAllBooks = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/books/all');
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load books:', error);
      alert('Failed to load books: ' + error.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadAllBooks();
      return;
    }

    setLoading(true);
    try {
      const data = await apiCall(`/books/search/${searchType}/${encodeURIComponent(searchTerm)}`);
      setBooks(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed: ' + error.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (bookId) => {
    try {
      await apiCall(`/cart/${userId}/add?bookId=${bookId}&quantity=1`, { 
        method: 'POST' 
      });
      alert('Added to cart!'); 
    } catch (error) {
      alert(error.message || 'Failed to add to cart');
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      await apiCall(`/books/admin/delete/${bookId}`, { method: 'DELETE' });
      alert('Book deleted successfully!');
      loadAllBooks();
    } catch (error) {
      alert('Failed to delete book: ' + error.message);
    }
  };

  const placePublisherOrder = async (bookId) => {
    const quantity = prompt('Enter quantity to order from publisher:');
    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      alert('Please enter a valid positive number');
      return;
    }

    try {
      await apiCall(`/publisherOrders/admin/place/${bookId}/${parseInt(quantity)}`, { 
        method: 'POST' 
      });
      alert('Publisher order placed successfully!');
      loadAllBooks();
    } catch (error) {
      alert('Failed to place publisher order: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {isAdmin ? 'Manage Books' : 'Browse Books'}
          </h2>
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus className="w-5 h-5" />
              Add Book
            </button>
          )}
        </div>
        
        <div className="flex gap-4">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="title">Title</option>
            <option value="isbn">ISBN</option>
            <option value="author">Author</option>
            <option value="category">Category</option>
            <option value="publisher">Publisher</option>
          </select>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder={`Search by ${searchType}...`}
          />

          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.bookID} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{book.title}</h3>
                <p className="text-sm text-gray-600">ISBN: {book.isbn}</p>
                <p className="text-sm text-gray-600">Category: {book.category}</p>
                {book.publicationYear && (
                  <p className="text-sm text-gray-600">Year: {book.publicationYear}</p>
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-indigo-600">
                  ${book.sellingPrice?.toFixed(2) || '0.00'}
                </span>
                <span className={`text-sm font-semibold ${book.numberOfBooks > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                  Stock: {book.numberOfBooks || 0}
                </span>
              </div>

              {isAdmin ? (
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setEditingBook(book)}
                    className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-1"
                    title="Edit Book"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-xs">Edit</span>
                  </button>
                  <button
                    onClick={() => placePublisherOrder(book.bookID)}
                    className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-1"
                    title="Order from Publisher"
                  >
                    <Package className="w-4 h-4" />
                    <span className="text-xs">Order</span>
                  </button>
                  <button
                    onClick={() => handleDeleteBook(book.bookID)}
                    className="bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-1"
                    title="Delete Book"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-xs">Delete</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleAddToCart(book.bookID)}
                  disabled={!book.numberOfBooks || book.numberOfBooks <= 0}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && books.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No books found. Try a different search.
        </div>
      )}

      {showAddModal && (
        <AddBookModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadAllBooks();
          }}
        />
      )}

      {editingBook && (
        <EditBookModal
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onSuccess={() => {
            setEditingBook(null);
            loadAllBooks();
          }}
        />
      )}
    </div>
  );
};

export default BooksPage;