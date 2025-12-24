import React from 'react';
import { ShoppingCart as CartIcon, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import CartItem from './CartItem';
import Button from '../common/Button';
import Card from '../common/Card';
import Loading from '../common/Loading';

export default function ShoppingCart() {
  const { cart, loading, totalPrice, clearCart, itemCount } = useCart();
  const navigate = useNavigate();
  const [clearing, setClearing] = React.useState(false);

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;
    
    setClearing(true);
    try {
      await clearCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
    } finally {
      setClearing(false);
    }
  };

  const handleCheckout = () => {
    navigate('/customer/checkout');
  };

  if (loading) {
    return <Loading message="Loading your cart..." />;
  }

  if (!cart || itemCount === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <div className="text-center py-12">
            <CartIcon className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
            <Button onClick={() => navigate('/customer/books')}>
              Browse Books
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Button
          variant="outline"
          icon={Trash2}
          onClick={handleClearCart}
          loading={clearing}
        >
          Clear Cart
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cart.cartItems?.map((item) => (
            <CartItem key={item.bookId} item={item} />
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card title="Order Summary">
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({itemCount} items)</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              
              <div className="border-t pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">{formatCurrency(totalPrice)}</span>
              </div>

              <Button fullWidth onClick={handleCheckout}>
                Proceed to Checkout
              </Button>

              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate('/customer/books')}
              >
                Continue Shopping
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}