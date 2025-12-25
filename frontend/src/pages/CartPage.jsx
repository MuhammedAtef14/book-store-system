import React, { useState, useEffect } from 'react';
import { apiCall } from '../api/api';

const CartPage = ({ userId }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    cardNumber: '',
    cardHolderName: '',
    expirationDate: '',
    cvv: ''
  });
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    if (userId) {
      loadCart();
    }
  }, [userId]);

  const loadCart = async () => {
    setLoading(true);
    try {
      const data = await apiCall(`/cart/${userId}`);
      setCart(data);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (bookId) => {
    try {
      await apiCall(`/cart/${userId}/remove?bookId=${bookId}`, { method: 'DELETE' });
      loadCart();
    } catch (error) {
      alert('Failed to remove item');
    }
  };

  const decrementItem = async (bookId) => {
    try {
      await apiCall(`/cart/${userId}/decrement?bookId=${bookId}`, { method: 'POST' });
      loadCart();
    } catch (error) {
      alert('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return;
    
    try {
      await apiCall(`/cart/${userId}/clear`, { method: 'DELETE' });
      loadCart();
    } catch (error) {
      alert('Failed to clear cart');
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      await apiCall(`/cart/${userId}/checkout`, {
        method: 'POST',
        body: JSON.stringify(checkoutData)
      });
      alert('Order placed successfully!');
      setShowCheckout(false);
      setCheckoutData({ cardNumber: '', cardHolderName: '', expirationDate: '', cvv: '' });
      loadCart();
    } catch (error) {
      alert('Checkout failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !cart) {
    return <div className="text-center py-12">Loading cart...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
          {cart?.cartItems?.length > 0 && (
            <button
              onClick={clearCart}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Clear Cart
            </button>
          )}
        </div>

        {!cart?.cartItems || cart.cartItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Your cart is empty
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cart.cartItems.map((item) => (
                <div key={item.bookId} className="flex items-center justify-between border-b pb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.bookTitle}</h3>
                    <p className="text-sm text-gray-600">Price: ${item.price?.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-indigo-600">
                      ${item.subTotal?.toFixed(2)}
                    </span>
                    <button
                      onClick={() => decrementItem(item.bookId)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <button
                      onClick={() => removeItem(item.bookId)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-gray-800">Total:</span>
                <span className="text-2xl font-bold text-indigo-600">
                  ${cart.totalPrice?.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => setShowCheckout(!showCheckout)}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
              >
                {showCheckout ? 'Hide Checkout' : 'Proceed to Checkout'}
              </button>
            </div>
          </>
        )}
      </div>

      {showCheckout && cart?.cartItems?.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Payment Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
              <input
                type="text"
                value={checkoutData.cardNumber}
                onChange={(e) => setCheckoutData({...checkoutData, cardNumber: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="1234567890123456"
                maxLength={16}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
              <input
                type="text"
                value={checkoutData.cardHolderName}
                onChange={(e) => setCheckoutData({...checkoutData, cardHolderName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry (MM/YY)</label>
                <input
                  type="text"
                  value={checkoutData.expirationDate}
                  onChange={(e) => setCheckoutData({...checkoutData, expirationDate: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="12/25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                <input
                  type="text"
                  value={checkoutData.cvv}
                  onChange={(e) => setCheckoutData({...checkoutData, cvv: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="123"
                  maxLength={3}
                />
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Complete Purchase'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;