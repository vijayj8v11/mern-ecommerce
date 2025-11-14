import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { 
  FaMapMarkerAlt, 
  FaCreditCard, 
  FaMoneyBillWave, 
  FaArrowLeft,
  FaUser,
  FaPhone,
  FaHome,
  FaCity,
  FaGlobe,
  FaMapPin
} from 'react-icons/fa';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    phone: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    // Load user's existing address if available
    if (user.address) {
      setAddress({
        street: user.address.street || '',
        city: user.address.city || '',
        state: user.address.state || '',
        zipCode: user.address.zipCode || '',
        country: user.address.country || 'India',
        phone: user.phone || ''
      });
    }
  }, [user, cartItems, navigate]);

  const handleAddressChange = (field, value) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const validateAddress = () => {
    const required = ['street', 'city', 'state', 'zipCode', 'phone'];
    for (const field of required) {
      if (!address[field].trim()) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) return;

    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item.product,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress: address,
        paymentMethod,
        totalAmount: getCartTotal() * 1.18, // Including 18% GST
        taxAmount: getCartTotal() * 0.18
      };

      if (paymentMethod === 'razorpay') {
        // Create Razorpay order
        const paymentResponse = await axios.post('/api/payment/create-order', {
          amount: Math.round(orderData.totalAmount * 100), // Convert to paise
          currency: 'INR'
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        // Initialize Razorpay
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_zfIyTuIGsNOnkb',
          amount: paymentResponse.data.amount,
          currency: paymentResponse.data.currency,
          name: 'MERN Shop',
          description: 'Order Payment',
          order_id: paymentResponse.data.id,
          handler: async (response) => {
            // Verify payment and create order
            await createOrder(orderData, response);
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: address.phone
          },
          theme: {
            color: '#3B82F6'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Cash on Delivery
        await createOrder(orderData);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData, paymentResponse = null) => {
    try {
      const finalOrderData = {
        ...orderData,
        paymentDetails: paymentResponse ? {
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_signature: paymentResponse.razorpay_signature
        } : null,
        status: paymentResponse ? 'paid' : 'pending'
      };

      const response = await axios.post('/api/orders', finalOrderData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/orders/${response.data._id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order. Please try again.');
    }
  };

  const calculateSubtotal = () => getCartTotal();
  const calculateTax = () => getCartTotal() * 0.18;
  const calculateTotal = () => calculateSubtotal() + calculateTax();

  if (!user) {
    return null;
  }

  return (
    <div className="checkout-container">
      <div className="container">
        {/* Header */}
        <div className="checkout-header">
          <div>
            <button
              onClick={() => navigate('/cart')}
              className="back-link"
            >
              <FaArrowLeft />
              Back to Cart
            </button>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '10px' }}>Checkout</h1>
          </div>
        </div>

        <div className="checkout-layout">
          {/* Left Column - Address and Payment */}
          <div className="checkout-form">
            {/* Shipping Address */}
            <div className="form-section">
              <div className="form-section-title">
                <FaMapMarkerAlt />
                Shipping Address
              </div>

              <div className="form-group">
                <div className="form-group-row">
                  <div className="form-field">
                    <label className="form-label">
                      <FaUser /> Full Name
                    </label>
                    <input
                      type="text"
                      value={user.name}
                      disabled
                      className="form-input"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">
                      <FaPhone /> Phone Number
                    </label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      className="form-input"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">
                  <FaHome /> Street Address
                </label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  className="form-input"
                  placeholder="Enter street address"
                />
              </div>

              <div className="form-group-row">
                <div className="form-field">
                  <label className="form-label">
                    <FaCity /> City
                  </label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="form-input"
                    placeholder="Enter city"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">
                    <FaMapPin /> State
                  </label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    className="form-input"
                    placeholder="Enter state"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">
                    <FaMapPin /> ZIP Code
                  </label>
                  <input
                    type="text"
                    value={address.zipCode}
                    onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                    className="form-input"
                    placeholder="Enter ZIP code"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">
                  <FaGlobe /> Country
                </label>
                <input
                  type="text"
                  value={address.country}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="form-section">
              <div className="form-section-title">
                <FaCreditCard />
                Payment Method
              </div>
              
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => handlePaymentMethodChange(e.target.value)}
                  />
                  <div className="payment-info">
                    <div className="payment-method-name">
                      <FaMoneyBillWave /> Cash on Delivery
                    </div>
                    <div className="payment-method-desc">Pay when you receive your order</div>
                  </div>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => handlePaymentMethodChange(e.target.value)}
                  />
                  <div className="payment-info">
                    <div className="payment-method-name">
                      <FaCreditCard /> Pay Online (Razorpay)
                    </div>
                    <div className="payment-method-desc">Credit/Debit cards, UPI, Net Banking</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div className="order-summary">
              <h2 className="summary-title">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.product} className="cart-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="item-image"
                    />
                    <div className="item-details">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-quantity">Qty: {item.quantity}</p>
                    </div>
                    <div className="item-total">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{calculateSubtotal().toLocaleString()}</span>
                </div>
                <div className="price-row">
                  <span>Tax (18% GST)</span>
                  <span>₹{calculateTax().toFixed(0)}</span>
                </div>
                <div className="price-row">
                  <span>Shipping</span>
                  <span className="free-shipping">Free</span>
                </div>
                <div className="price-row total">
                  <span>Total</span>
                  <span>₹{calculateTotal().toFixed(0)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="place-order-btn"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    {paymentMethod === 'cod' ? 'Place Order (COD)' : 'Proceed to Payment'}
                  </>
                )}
              </button>

              {/* Additional Info */}
              <div className="order-info-box">
                <h3 className="order-info-title">Order Information</h3>
                <ul className="order-info-list">
                  <li className="order-info-item">• Delivery within 3-5 business days</li>
                  <li className="order-info-item">• Free shipping on all orders</li>
                  <li className="order-info-item">• Easy returns within 30 days</li>
                  <li className="order-info-item">• Secure payment processing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 