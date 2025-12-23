import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useBooks } from '../../hooks/useBooks';
import { useDebounce } from '../../hooks/useDebounce';
import { BOOK_CATEGORIES } from '../../utils/constants';
import Input from '../common/Input';
import Button from '../common/Button';

export default function BookSearch({ onSearch }) {
  const { searchBooks, filters, clearFilters } = useBooks();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    category: '',
    author: '',
    publisher: '',
  });

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch || Object.values(localFilters).some(v => v)) {
      handleSearch();
    }
  }, [debouncedSearch, localFilters]);

  const handleSearch = async () => {
    const params = {
      title: searchTerm,
      ...localFilters,
    };
    
    try {
      const results = await searchBooks(params);
      onSearch(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setLocalFilters({
      category: '',
      author: '',
      publisher: '',
    });
    clearFilters();
    onSearch([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Search books by title, ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          icon={Filter}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters
        </Button>
        {(searchTerm || Object.values(localFilters).some(v => v)) && (
          <Button
            variant="outline"
            icon={X}
            onClick={handleClearFilters}
          >
            Clear
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Category
            </label>
            <select
              value={localFilters.category}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Categories</option>
              {BOOK_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <Input
            label="Author"
            placeholder="Search by author"
            value={localFilters.author}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, author: e.target.value }))}
          />

          <Input
            label="Publisher"
            placeholder="Search by publisher"
            value={localFilters.publisher}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, publisher: e.target.value }))}
          />
        </div>
      )}
    </div>
  );
}