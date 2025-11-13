import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
  loading: false
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        total: action.payload.total || 0,
        loading: false
      };
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => 
        item.product._id === action.payload.product._id
      );
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product._id === action.payload.product._id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
          total: state.total + (action.payload.price * action.payload.quantity)
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload],
          total: state.total + (action.payload.price * action.payload.quantity)
        };
      }
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.itemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.items.reduce((sum, item) => 
          sum + (item._id === action.payload.itemId 
            ? item.price * action.payload.quantity 
            : item.price * item.quantity), 0
        )
      };
    case 'REMOVE_ITEM':
      const removedItem = state.items.find(item => item._id === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload),
        total: state.total - (removedItem ? removedItem.price * removedItem.quantity : 0)
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Load cart from server
  const loadCart = async () => {
    if (!isAuthenticated) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await axios.get('/api/cart');
      dispatch({ type: 'SET_CART', payload: res.data });
    } catch (err) {
      console.error('Error loading cart:', err);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Add item to cart
  const addToCart = async (productData, quantity = 1) => {
    if (!isAuthenticated) {
      // For non-authenticated users, store in localStorage
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = localCart.find(item => item.product === productData.product);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        localCart.push({
          product: productData.product,
          name: productData.name,
          price: productData.price,
          image: productData.image,
          stock: productData.stock,
          quantity: quantity
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(localCart));
      dispatch({ type: 'SET_CART', payload: { items: localCart, total: localCart.reduce((sum, item) => sum + (item.price * item.quantity), 0) } });
      return { success: true };
    }

    try {
      const res = await axios.post('/api/cart/add', { 
        productId: productData.product, 
        quantity 
      });
      dispatch({ type: 'SET_CART', payload: res.data });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add item to cart';
      return { success: false, message };
    }
  };

  // Update item quantity
  const updateCartItem = async (itemId, quantity) => {
    if (!isAuthenticated) {
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const item = localCart.find(item => item.product === itemId);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(localCart));
        dispatch({ type: 'SET_CART', payload: { items: localCart, total: localCart.reduce((sum, item) => sum + (item.price * item.quantity), 0) } });
      }
      return { success: true };
    }

    try {
      const res = await axios.put(`/api/cart/update/${itemId}`, { quantity });
      dispatch({ type: 'SET_CART', payload: res.data });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update quantity';
      return { success: false, message };
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    if (!isAuthenticated) {
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const updatedCart = localCart.filter(item => item.product !== itemId);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      dispatch({ type: 'SET_CART', payload: { items: updatedCart, total: updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0) } });
      return { success: true };
    }

    try {
      const res = await axios.delete(`/api/cart/remove/${itemId}`);
      dispatch({ type: 'SET_CART', payload: res.data });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to remove item';
      return { success: false, message };
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!isAuthenticated) {
      localStorage.removeItem('cart');
      return { success: true };
    }

    try {
      await axios.delete('/api/cart/clear');
      dispatch({ type: 'CLEAR_CART' });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to clear cart';
      return { success: false, message };
    }
  };

  // Get cart item count
  const getCartItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  // Get cart total
  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    }
  }, [isAuthenticated]);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        cartItems: state.items,
        total: state.total,
        loading: state.loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        getCartItemCount,
        getCartTotal,
        loadCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 