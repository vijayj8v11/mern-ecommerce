# MERN E-Commerce Platform

<div align="center">

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A full-stack e-commerce web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring user authentication, product management, shopping cart functionality, and Razorpay payment integration.

### 🎬 Project Screenshots

| Feature | Screenshot |
|---------|-----------|
| Home Page | ![Home](./assets/home.png) |
| Product Listing | ![Products](./assets/products.png) |
| Shopping Cart | ![Cart](./assets/cart.png) |
| Checkout | ![Checkout](./assets/checkout.png) |
| Admin Dashboard | ![Admin](./assets/admin-dashboard.png) |
| Product Management | ![Product Mgmt](./assets/product-management.png) |

</div>

## 🚀 Features

### User Features
- **User Authentication**: Register, login, and profile management
- **Product Browsing**: Browse products with advanced filtering and search
- **Shopping Cart**: Add, remove, and update cart items
- **Order Management**: Place orders and view order history
- **Payment Integration**: Secure payments with Razorpay
- **Product Reviews**: Rate and review products
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and update order status
- **User Management**: View user information
- **Dashboard**: Analytics and overview

### Technical Features
- **JWT Authentication**: Secure token-based authentication
- **RESTful API**: Well-structured API endpoints
- **Image Upload**: Product image management
- **Search & Filtering**: Advanced product search and filtering
- **Pagination**: Efficient data loading
- **Real-time Updates**: Live cart and order updates

## 🛠️ Tech Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **Razorpay**: Payment gateway
- **Multer**: File upload handling

### Frontend
- **React.js**: UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **React Icons**: Icon library
- **React Toastify**: Notifications
- **Styled Components**: CSS-in-JS

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Razorpay account (for payments)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mern-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `config.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mern_ecommerce
   JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret_key
   ```

4. **Seed the database**
   ```bash
   node utils/seedData.js
   ```

5. **Start the server**
   ```bash
   npm run server
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

### Running Both Servers

From the root directory:
```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend development server (port 3000).

## 🗄️ Database Schema

### User Model
- Name, email, password
- Role (user/admin)
- Address information
- Profile avatar

### Product Model
- Name, description, price
- Category, brand, images
- Stock quantity, ratings
- Reviews and specifications
- Discount percentage

### Cart Model
- User reference
- Product items with quantities
- Total price calculation

### Order Model
- User and order items
- Shipping address
- Payment information
- Order status tracking

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `POST /api/products/:id/reviews` - Add product review

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item
- `DELETE /api/cart/remove/:itemId` - Remove cart item
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/pay` - Mark order as paid
- `PUT /api/orders/:id/deliver` - Mark order as delivered (admin)

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment
- `GET /api/payment/keys` - Get payment keys

## 🎨 Features in Detail

### Product Filtering & Search
- Category-based filtering
- Price range filtering
- Brand filtering
- Rating filtering
- Search by product name/description
- Sorting by price, rating, date

### Shopping Cart
- Persistent cart storage
- Quantity management
- Real-time total calculation
- Stock validation

### Payment Integration
- Razorpay payment gateway
- Payment verification
- Order confirmation
- Transaction history

### Admin Dashboard
- Product management interface
- Order status updates
- User management
- Sales analytics

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Environment variable protection
- Payment signature verification

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Configure MongoDB connection
3. Set up Razorpay credentials
4. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy the build folder to platforms like Netlify, Vercel, or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Default Users

After seeding the database, you can use these default accounts:

### Admin User
- Email: admin@example.com
- Password: admin123

### Regular User
- Email: john@example.com
- Password: password123

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in config.env

2. **Payment Integration Issues**
   - Verify Razorpay credentials
   - Check payment key configuration

3. **CORS Errors**
   - Ensure backend CORS is properly configured
   - Check frontend proxy settings

4. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Happy Shopping! 🛒** 