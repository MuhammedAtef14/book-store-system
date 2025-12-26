import React, { useState } from 'react';
import { apiCall } from '../api/api';
import { X } from 'lucide-react';

const AddBookModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    publicationYear: '',
    sellingPrice: '',
    category: 'Science',
    numberOfBooks: '',
    minimumQuantity: '',
    publisherID: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const bookData = {
        ...formData,
        publicationYear: parseInt(formData.publicationYear),
        sellingPrice: parseFloat(formData.sellingPrice),
        numberOfBooks: parseInt(formData.numberOfBooks),
        minimumQuantity: parseInt(formData.minimumQuantity),
        publisher: { publisherID: parseInt(formData.publisherID) }
      };

      await apiCall('/books/admin/add', {
        method: 'POST',
        body: JSON.stringify(bookData)
      });

      alert('Book added successfully!');
      onSuccess();
    } catch (error) {
      alert('Failed to add book: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Add New Book</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISBN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => handleChange('isbn', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="978-3-16-148410-0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Book Title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publication Year
              </label>
              <input
                type="number"
                value={formData.publicationYear}
                onChange={(e) => handleChange('publicationYear', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="2024"
                min="1900"
                max="2100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selling Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.sellingPrice}
                onChange={(e) => handleChange('sellingPrice', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="29.99"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Science">Science</option>
                <option value="Art">Art</option>
                <option value="Religion">Religion</option>
                <option value="History">History</option>
                <option value="Geography">Geography</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.numberOfBooks}
                onChange={(e) => handleChange('numberOfBooks', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="100"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.minimumQuantity}
                onChange={(e) => handleChange('minimumQuantity', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="10"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publisher ID <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.publisherID}
                onChange={(e) => handleChange('publisherID', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="1"
                min="1"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-semibold"
            >
              {loading ? 'Adding...' : 'Add Book'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBookModal;