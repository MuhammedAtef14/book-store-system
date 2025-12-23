import { api } from './api';

export const cartService = {
  async getCart(userId) {
    const response = await api.request(`/cart/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }
    
    return await response.json();
  },

  async addToCart(userId, bookId, quantity) {
    const response = await api.request(`/cart/${userId}/add?bookId=${bookId}&quantity=${quantity}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to add item to cart');
    }
  },

  async removeFromCart(userId, bookId) {
    const response = await api.request(`/cart/${userId}/remove?bookId=${bookId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove item');
    }
  },

  async decrementQuantity(userId, bookId) {
    const response = await api.request(`/cart/${userId}/decrement?bookId=${bookId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to decrement quantity');
    }
  },

  async clearCart(userId) {
    const response = await api.request(`/cart/${userId}/clear`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }
  },

  async checkout(userId, creditCard) {
    const response = await api.request(`/cart/${userId}/checkout`, {
      method: 'POST',
      body: JSON.stringify(creditCard),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Checkout failed');
    }
    
    return await response.text();
  }
};