import { api } from './api';

export const orderService = {
  async getOrderHistory(userId) {
    const response = await api.request(`/orders/user/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch order history');
    }
    
    return await response.json();
  },

  async getOrderDetails(orderId) {
    const response = await api.request(`/orders/${orderId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch order details');
    }
    
    return await response.json();
  },

  // Admin only
  async getAllOrders() {
    const response = await api.request('/orders/admin/all');
    
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    
    return await response.json();
  },

  async updateOrderStatus(orderId, status) {
    const response = await api.request(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update order status');
    }
  },

  async getSalesReport(params) {
    const queryParams = new URLSearchParams(params);
    const response = await api.request(`/orders/admin/reports/sales?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch sales report');
    }
    
    return await response.json();
  },

  async getTopCustomers() {
    const response = await api.request('/orders/admin/reports/top-customers');
    
    if (!response.ok) {
      throw new Error('Failed to fetch top customers');
    }
    
    return await response.json();
  },

  async getTopBooks() {
    const response = await api.request('/orders/admin/reports/top-books');
    
    if (!response.ok) {
      throw new Error('Failed to fetch top books');
    }
    
    return await response.json();
  }
};