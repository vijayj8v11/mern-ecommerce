import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import {
  FaCheckCircle,
  FaTruck,
  FaCreditCard,
  FaMoneyBillWave,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCalendar,
  FaReceipt,
  FaClock,
  FaTimesCircle,
  FaBox,
  FaShieldAlt,
  FaUser,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';
import axios from 'axios';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrder();
  }, [id, user, navigate]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
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
      return {
        text: 'Cash on Delivery',
        icon: <FaMoneyBillWave className="text-orange-600" />,
        color: 'text-orange-600',
        description: 'Pay when you receive your order'
      };
    } else {
      return {
        text: 'Paid Online',
        icon: <FaCreditCard className="text-green-600" />,
        color: 'text-green-600',
        description: 'Payment completed online'
      };
    }
  };

  const getStatusTimeline = (order) => {
    const timeline = [
      {
        status: 'Order Placed',
        date: new Date(order.createdAt),
        icon: <FaReceipt className="text-blue-600" />,
        completed: true
      }
    ];

    if (order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered') {
      timeline.push({
        status: 'Processing',
        date: order.createdAt, // Approximate
        icon: <FaClock className="text-yellow-600" />,
        completed: true
      });
    }

    if (order.status === 'Shipped' || order.status === 'Delivered') {
      timeline.push({
        status: 'Shipped',
        date: order.createdAt, // Approximate
        icon: <FaTruck className="text-blue-600" />,
        completed: true
      });
    }

    if (order.status === 'Delivered') {
      timeline.push({
        status: 'Delivered',
        date: order.deliveredAt || new Date(),
        icon: <FaCheckCircle className="text-green-600" />,
        completed: true
      });
    }

    if (order.status === 'Cancelled') {
      timeline.push({
        status: 'Cancelled',
        date: new Date(),
        icon: <FaTimesCircle className="text-red-600" />,
        completed: true
      });
    }

    return timeline;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const paymentStatus = getPaymentStatus(order);
  const timeline = getStatusTimeline(order);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" />
            Back to Orders
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600">Order #{order._id.slice(-8).toUpperCase()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="ml-2">{order.status}</span>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${paymentStatus.color} bg-gray-100`}>
            {paymentStatus.icon}
            <span className="ml-2">{paymentStatus.text}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaBox className="mr-2" />
              Order Items
            </h2>
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(0)}</p>
                    <p className="text-sm text-gray-600">₹{item.price} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Timeline</h2>
            <div className="space-y-4">
              {timeline.map((step, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{step.status}</p>
                    <p className="text-sm text-gray-600">
                      {step.date.toLocaleDateString()} at {step.date.toLocaleTimeString()}
                    </p>
                  </div>
                  {step.completed && (
                    <div className="flex-shrink-0">
                      <FaCheckCircle className="text-green-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              Shipping Address
            </h2>
            <div className="space-y-2">
              <p className="text-gray-900">{user.name}</p>
              <p className="text-gray-600">{order.shippingAddress.street}</p>
              <p className="text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p className="text-gray-600">{order.shippingAddress.country}</p>
              {user.phone && <p className="text-gray-600">Phone: {user.phone}</p>}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{order.itemsPrice.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (18% GST)</span>
                <span>₹{order.taxPrice.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>₹{order.totalPrice.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaShieldAlt className="mr-2" />
              Payment Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                {paymentStatus.icon}
                <div>
                  <p className="font-medium text-gray-900">{paymentStatus.text}</p>
                  <p className="text-sm text-gray-600">{paymentStatus.description}</p>
                </div>
              </div>
              {order.paymentMethod === 'Razorpay' && order.razorpayPaymentId && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Payment ID: {order.razorpayPaymentId}</p>
                  <p className="text-sm text-gray-600">Order ID: {order.razorpayOrderId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 text-sm">Order Date</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Order Time</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleTimeString()}</p>
              </div>
              {order.paidAt && (
                <div>
                  <p className="text-gray-600 text-sm">Payment Date</p>
                  <p className="font-medium">{new Date(order.paidAt).toLocaleDateString()}</p>
                </div>
              )}
              {order.deliveredAt && (
                <div>
                  <p className="text-gray-600 text-sm">Delivered Date</p>
                  <p className="font-medium">{new Date(order.deliveredAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail; 