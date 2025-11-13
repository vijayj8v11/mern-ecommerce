import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { 
  FaShoppingCart, 
  FaTrash, 
  FaMinus, 
  FaPlus, 
  FaArrowLeft,
  FaCreditCard,
  FaTruck
} from 'react-icons/fa';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateCartItem, removeFromCart, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      toast.error('Quantity cannot be less than 1');
      return;
    }
    
    const item = cartItems.find(item => item.product === itemId);
    if (newQuantity > item.stock) {
      toast.error(`Only ${item.stock} items available in stock`);
      return;
    }
    
    updateCartItem(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
    toast.success('Item removed from cart');
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to proceed to checkout');
      navigate('/login');
      return;
    }
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="mb-6">
            <FaShoppingCart className="mx-auto text-6xl text-gray-300 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={handleContinueShopping}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Continue Shopping
            </button>
            <div>
              <button
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-800 font-medium"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Cart Items</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item.product} className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Price: ₹{item.price.toLocaleString()}
                          </p>
                          {item.stock < 10 && (
                            <p className="text-orange-600 text-sm">
                              Only {item.stock} left in stock
                            </p>
                          )}
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.product)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Remove item"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-700 font-medium">Quantity:</span>
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.product, item.quantity - 1)}
                              className="px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                              disabled={item.quantity <= 1}
                            >
                              <FaMinus className="w-3 h-3" />
                            </button>
                            <span className="px-4 py-1 border-x text-center min-w-[3rem]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.product, item.quantity + 1)}
                              className="px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                              disabled={item.quantity >= item.stock}
                            >
                              <FaPlus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-sm text-gray-500">
                              ₹{item.price.toLocaleString()} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                <span>₹{getCartTotal().toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>₹{(getCartTotal() * 0.18).toFixed(0)}</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>₹{(getCartTotal() * 1.18).toFixed(0)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Including 18% GST</p>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center space-x-2 mb-4"
            >
              <FaCreditCard />
              <span>Proceed to Checkout</span>
            </button>

            {/* Continue Shopping */}
            <button
              onClick={handleContinueShopping}
              className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center space-x-2"
            >
              <FaTruck />
              <span>Continue Shopping</span>
            </button>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Shipping Information</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Free shipping on orders above ₹500</li>
                <li>• Delivery within 3-5 business days</li>
                <li>• Easy returns within 30 days</li>
                <li>• Secure payment options</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Empty Cart Message (hidden when items exist) */}
      {cartItems.length === 0 && (
        <div className="text-center py-12">
          <FaShoppingCart className="mx-auto text-6xl text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <button
            onClick={handleContinueShopping}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart; 