import React, { useState } from 'react';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';
import Alert from '../common/Alert';

export default function BookCard({ book, onViewDetails }) {
  const { addToCart, isInCart } = useCart();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addToCart(book.bookID, 1);
      setAlert({ type: 'success', message: 'Added to cart!' });
      setTimeout(() => setAlert(null), 2000);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const inCart = isInCart(book.bookID);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {alert && (
        <div className="p-2">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}
      
      <div className="p-4">
        <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-indigo-100 rounded-md mb-4 flex items-center justify-center">
          <span className="text-4xl">📚</span>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2">{book.title}</h3>
          
          <p className="text-sm text-gray-600">
            {book.authors?.map(a => a.name).join(', ') || 'Unknown Author'}
          </p>
          
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
              {book.category}
            </span>
            {book.numberOfBooks > 0 ? (
              <span className="text-xs text-green-600">In Stock</span>
            ) : (
              <span className="text-xs text-red-600">Out of Stock</span>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-xl font-bold text-blue-600">
              {formatCurrency(book.sellingPrice)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 border-t flex gap-2">
        <Button
          variant="outline"
          size="sm"
          icon={Eye}
          onClick={() => onViewDetails(book)}
          className="flex-1"
        >
          View
        </Button>
        <Button
          variant={inCart ? 'secondary' : 'primary'}
          size="sm"
          icon={ShoppingCart}
          loading={loading}
          onClick={handleAddToCart}
          disabled={book.numberOfBooks === 0 || inCart}
          className="flex-1"
        >
          {inCart ? 'In Cart' : 'Add'}
        </Button>
      </div>
    </div>
  );
}