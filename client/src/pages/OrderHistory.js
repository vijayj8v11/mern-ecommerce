import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { 
  FaReceipt, 
  FaEye, 
  FaCheckCircle, 
  FaClock, 
  FaTruck, 
  FaTimesCircle,
  FaCreditCard,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaBan,
  FaSpinner
} from 'react-icons/fa';
import axios from 'axios';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/orders/myorders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-600 bg-green-100';
      case 'Shipped':
        return 'text-blue-600 bg-blue-100';
      case 'Processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'Cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <FaCheckCircle className="text-green-600" />;
      case 'Shipped':
        return <FaTruck className="text-blue-600" />;
      case 'Processing':
        return <FaClock className="text-yellow-600" />;
      case 'Cancelled':
        return <FaTimesCircle className="text-red-600" />;
      default:
        return <FaReceipt className="text-gray-600" />;
    }
  };

  const getPaymentStatus = (order) => {
    if (order.paymentMethod === 'Cash on Delivery') {
      if (order.status === 'Delivered') {
        return { text: 'COD - Paid', icon: <FaMoneyBillWave className="text-green-600" />, color: 'text-green-600 bg-green-100' };
      } else {
        return { text: 'COD - Pending', icon: <FaMoneyBillWave className="text-orange-600" />, color: 'text-orange-600 bg-orange-100' };
      }
    } else {
      return { text: 'Paid Online', icon: <FaCreditCard className="text-green-600" />, color: 'text-green-600 bg-green-100' };
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancellingOrderId(orderId);
    try {
      await axios.put(`/api/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      toast.success('Order cancelled successfully');
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const canCancelOrder = (order) => {
    return order.status === 'Pending' || order.status === 'Processing';
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'pending') return order.status === 'Pending';
    if (filter === 'delivered') return order.status === 'Delivered';
    if (filter === 'cancelled') return order.status === 'Cancelled';
    return true;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Filter:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <FaReceipt className="mx-auto text-6xl text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders found</h2>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? "You haven't placed any orders yet." 
              : `No ${filter} orders found.`
            }
          </p>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const paymentStatus = getPaymentStatus(order);
            return (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold">Order #{order._id.slice(-8).toUpperCase()}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FaCalendarAlt className="text-gray-400" />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${paymentStatus.color} bg-gray-100`}>
                      {paymentStatus.icon}
                      <span className="ml-1">{paymentStatus.text}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Total Amount</p>
                    <p className="font-semibold">₹{order.totalPrice.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Items</p>
                    <p className="font-semibold">{order.orderItems.length} items</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Payment Method</p>
                    <p className="font-semibold capitalize">
                      {order.paymentMethod === 'Cash on Delivery' ? 'Cash on Delivery' : 'Online Payment'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Order Date</p>
                    <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">Order Items:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {order.orderItems.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.orderItems.length > 3 && (
                      <div className="flex items-center justify-center p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">
                          +{order.orderItems.length - 3} more items
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    {canCancelOrder(order) && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancellingOrderId === order._id}
                        className="flex items-center text-red-600 hover:text-red-800 font-medium mr-4 disabled:opacity-50"
                      >
                        {cancellingOrderId === order._id ? (
                          <FaSpinner className="mr-2 animate-spin" />
                        ) : (
                          <FaBan className="mr-2" />
                        )}
                        {cancellingOrderId === order._id ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}
                  </div>
                  <Link
                    to={`/orders/${order._id}`}
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <FaEye className="mr-2" />
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistory; 