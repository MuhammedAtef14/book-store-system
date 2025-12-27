import React, { useState, useEffect } from 'react';
import { apiCall } from '../api/api';
import { TrendingUp, Users, Book, Package, DollarSign, Calendar } from 'lucide-react';

const AdminDashboard = () => {
  const [reports, setReports] = useState({
    totalSalesMonth: 0,
    top5Customers: [],
    top10Books: [],
    salesByDate: 0
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [publisherOrders, setPublisherOrders] = useState({
    pending: [],
    completed: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [monthSales, top5, top10, pending, completed] = await Promise.all([
        apiCall('/reports/admin/totalSales/previousMonth'),
        apiCall('/reports/admin/top5Customers'),
        apiCall('/reports/admin/top10Books'),
        apiCall('/publisherOrders/admin/pending'),
        apiCall('/publisherOrders/admin/completed')
      ]);

      setReports({
        totalSalesMonth: monthSales || 0,
        top5Customers: top5 || [],
        top10Books: top10 || [],
        salesByDate: 0
      });

      setPublisherOrders({
        pending: pending || [],
        completed: completed || []
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      alert('Failed to load dashboard data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSearch = async () => {
    try {
      const sales = await apiCall(`/reports/admin/totalSales/date/${selectedDate}`);
      setReports(prev => ({ ...prev, salesByDate: sales || 0 }));
    } catch (error) {
      alert('Failed to fetch sales for date: ' + error.message);
    }
  };

  const confirmOrder = async (orderId) => {
    try {
      await apiCall(`/publisherOrders/admin/confirm/${orderId}`, { method: 'PUT' });
      alert('Order confirmed successfully!');
      loadDashboardData();
    } catch (error) {
      alert('Failed to confirm order: ' + error.message);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      await apiCall(`/publisherOrders/admin/delete/${orderId}`, { method: 'DELETE' });
      alert('Order deleted successfully!');
      loadDashboardData();
    } catch (error) {
      alert('Failed to delete order: ' + error.message);
    }
  };

  const placePublisherOrder = async (bookId) => {
    const quantity = prompt('Enter quantity to order:');
    if (!quantity || isNaN(quantity)) return;

    try {
      await apiCall(`/publisherOrders/admin/place/${bookId}/${quantity}`, { method: 'POST' });
      alert('Publisher order placed successfully!');
      loadDashboardData();
    } catch (error) {
      alert('Failed to place order: ' + error.message);
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
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Previous Month Sales</p>
              <p className="text-2xl font-bold text-indigo-600">
                ${Number(reports.totalSalesMonth).toFixed(2)}
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-indigo-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Top Customers</p>
              <p className="text-2xl font-bold text-green-600">
                {reports.top5Customers.length}
              </p>
            </div>
            <Users className="w-12 h-12 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Top Books</p>
              <p className="text-2xl font-bold text-blue-600">
                {reports.top10Books.length}
              </p>
            </div>
            <Book className="w-12 h-12 text-blue-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Sales by Date */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Sales by Date
        </h2>
        <div className="flex gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <button
            onClick={handleDateSearch}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Search
          </button>
        </div>
        {reports.salesByDate > 0 && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
            <p className="text-lg">
              Total Sales on {selectedDate}: 
              <span className="font-bold text-indigo-600 ml-2">
                ${Number(reports.salesByDate).toFixed(2)}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Top 5 Customers */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Top 5 Customers (Last 3 Months)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Username</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">User ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.top5Customers.map((customer, index) => (
                <tr key={customer.UserID} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    <span className="font-bold text-indigo-600">#{index + 1}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">{customer.Username}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{customer.UserID}</td>
                  <td className="px-4 py-3 text-sm font-bold text-green-600">
                    ${Number(customer.total_spent).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top 10 Books */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Book className="w-6 h-6" />
          Top 10 Selling Books (Last 3 Months)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Book ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Copies Sold</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.top10Books.map((book, index) => (
                <tr key={book.BookID} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    <span className="font-bold text-indigo-600">#{index + 1}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{book.BookID}</td>
                  <td className="px-4 py-3 text-sm font-medium">{book.Title}</td>
                  <td className="px-4 py-3 text-sm font-bold text-blue-600">
                    {book.total_sold}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Publisher Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Package className="w-6 h-6 text-orange-600" />
            Pending Publisher Orders
          </h2>
          <div className="space-y-3">
            {publisherOrders.pending.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending orders</p>
            ) : (
              publisherOrders.pending.map((order) => (
                <div key={order.publisherOrderID} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">Order #{order.publisherOrderID}</p>
                      <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                      <p className="text-sm text-gray-600">Book ID: {order.book?.bookID}</p>
                    </div>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                      {order.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => confirmOrder(order.publisherOrderID)}
                      className="flex-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => deleteOrder(order.publisherOrderID)}
                      className="flex-1 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Package className="w-6 h-6 text-green-600" />
            Completed Publisher Orders
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {publisherOrders.completed.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No completed orders</p>
            ) : (
              publisherOrders.completed.map((order) => (
                <div key={order.publisherOrderID} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Order #{order.publisherOrderID}</p>
                      <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                      <p className="text-sm text-gray-600">Book ID: {order.book?.bookID}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;