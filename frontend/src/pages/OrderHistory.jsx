import React, { useState, useEffect } from 'react';
import { apiCall } from '../api/api';
import { Package, Calendar, DollarSign, Book } from 'lucide-react';

const OrderHistory = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await apiCall(`/customer/${userId}/viewPastOrders`);
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Package className="w-8 h-8 text-indigo-600" />
          Order History
        </h2>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No orders found</p>
            <p className="text-sm text-gray-400 mt-2">Your order history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="border rounded-lg p-6 hover:shadow-md transition cursor-pointer"
                onClick={() => setSelectedOrder(selectedOrder?.orderId === order.orderId ? null : order)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Order #{order.orderId}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.orderDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${order.totalPrice?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                    <Book className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {order.books?.length || 0} book{order.books?.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {selectedOrder?.orderId === order.orderId && order.books && order.books.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold mb-3">Books in this order:</h4>
                    <div className="space-y-2">
                      {order.books.map((book, index) => (
                        <div 
                          key={`${order.orderId}-${book.isbn}-${index}`}
                          className="flex items-center gap-3 bg-gray-50 p-3 rounded"
                        >
                          <Book className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{book.title}</p>
                            <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;