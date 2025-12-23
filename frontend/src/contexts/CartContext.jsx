import React, { createContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from '../hooks/useAuth';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Extract userId from user object (you may need to adjust based on your user structure)
  const getUserId = useCallback(() => {
    // If you store userId in user object after login
    return user?.userId || null;
  }, [user]);

  // Fetch cart on mount and when user changes
  useEffect(() => {
    if (isAuthenticated && getUserId()) {
      fetchCart();
    } else {
      resetCart();
    }
  }, [isAuthenticated, user]);

  const fetchCart = async () => {
    const userId = getUserId();
    if (!userId) return;

    setLoading(true);
    try {
      const cartData = await cartService.getCart(userId);
      setCart(cartData);
      
      // Calculate item count and total price
      const count = cartData.cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setItemCount(count);
      setTotalPrice(cartData.totalPrice || 0);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCart({ cartItems: [], totalPrice: 0 });
      setItemCount(0);
      setTotalPrice(0);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (bookId, quantity = 1) => {
    const userId = getUserId();
    if (!userId) throw new Error('User not authenticated');

    try {
      await cartService.addToCart(userId, bookId, quantity);
      await fetchCart(); // Refresh cart after adding
      return true;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (bookId) => {
    const userId = getUserId();
    if (!userId) throw new Error('User not authenticated');

    try {
      await cartService.removeFromCart(userId, bookId);
      await fetchCart(); // Refresh cart after removing
      return true;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  };

  const decrementQuantity = async (bookId) => {
    const userId = getUserId();
    if (!userId) throw new Error('User not authenticated');

    try {
      await cartService.decrementQuantity(userId, bookId);
      await fetchCart(); // Refresh cart after decrementing
      return true;
    } catch (error) {
      console.error('Failed to decrement quantity:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    const userId = getUserId();
    if (!userId) throw new Error('User not authenticated');

    try {
      await cartService.clearCart(userId);
      resetCart();
      return true;
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  };

  const checkout = async (creditCardInfo) => {
    const userId = getUserId();
    if (!userId) throw new Error('User not authenticated');

    try {
      const response = await cartService.checkout(userId, creditCardInfo);
      resetCart(); // Clear cart after successful checkout
      return response;
    } catch (error) {
      console.error('Checkout failed:', error);
      throw error;
    }
  };

  const resetCart = () => {
    setCart({ cartItems: [], totalPrice: 0 });
    setItemCount(0);
    setTotalPrice(0);
  };

  const getCartItem = useCallback((bookId) => {
    return cart?.cartItems?.find(item => item.bookId === bookId);
  }, [cart]);

  const isInCart = useCallback((bookId) => {
    return cart?.cartItems?.some(item => item.bookId === bookId) || false;
  }, [cart]);

  const value = {
    cart,
    loading,
    itemCount,
    totalPrice,
    fetchCart,
    addToCart,
    removeFromCart,
    decrementQuantity,
    clearCart,
    checkout,
    getCartItem,
    isInCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}