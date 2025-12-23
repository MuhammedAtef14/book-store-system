import React, { useState, useEffect } from 'react';
import { Package, Calendar, DollarSign } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { ORDER_STATUS } from '../../utils/constants';
import Card from '../common/Card';
import Loading from '../common/Loading';
import Button from '../common/Button';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // You'll need to get userId from auth context
      const userId = 1; // Replace with actual userId
      const data = await orderService.getOrderHistory(userId);
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <Loading message="Loading your orders..." />;
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchOrders} className="mt-4">
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <div className="text-center py-12">
            <Package className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
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
      <h1 className="text-3xl font-bold mb-6">Order History</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.customerOrderID}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Order #{order.customerOrderID}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateTime(order.orderDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(order.totalPrice)}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {order.items && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Items ({order.items.length})
                  </p>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.bookID} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.book?.title} × {item.quantity}
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => setSelectedOrder(order)}
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}