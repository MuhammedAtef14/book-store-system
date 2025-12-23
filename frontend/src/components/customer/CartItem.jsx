import React, { useState } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';

export default function CartItem({ item }) {
  const { addToCart, decrementQuantity, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleIncrement = async () => {
    setLoading(true);
    try {
      await addToCart(item.bookId, 1);
    } catch (error) {
      console.error('Failed to increment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrement = async () => {
    setLoading(true);
    try {
      await decrementQuantity(item.bookId);
    } catch (error) {
      console.error('Failed to decrement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      await removeFromCart(item.bookId);
    } catch (error) {
      console.error('Failed to remove:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="w-16 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded flex items-center justify-center flex-shrink-0">
        <span className="text-2xl">📚</span>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{item.bookTitle}</h3>
        <p className="text-sm text-gray-600">{formatCurrency(item.price)}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={handleDecrement}
            disabled={loading || item.quantity <= 1}
            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded transition disabled:opacity-50"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-semibold">{item.quantity}</span>
          <button
            onClick={handleIncrement}
            disabled={loading}
            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded transition disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="text-right min-w-[80px]">
          <p className="font-bold text-blue-600">{formatCurrency(item.subTotal)}</p>
        </div>

        <button
          onClick={handleRemove}
          disabled={loading}
          className="text-red-500 hover:text-red-700 transition disabled:opacity-50"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}