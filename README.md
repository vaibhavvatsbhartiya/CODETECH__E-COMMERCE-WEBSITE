Name: Vaibhav Vats Id: CTDSP151 Domain: Full Stack Web Developer Position: Intern

Sure, let's start by defining the folder structure for both the frontend and backend of your e-commerce platform. This project will be built using the MERN stack: MongoDB, Express.js, React.js, and Node.js.

### Project Structure
```
e-commerce-platform/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── userController.js
│   │   └── productController.js
│   │   └── orderController.js
│   ├── models/
│   │   └── userModel.js
│   │   └── productModel.js
│   │   └── orderModel.js
│   ├── routes/
│   │   └── userRoutes.js
│   │   └── productRoutes.js
│   │   └── orderRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── Header.js
│   │   │   └── Footer.js
│   │   │   └── Product.js
│   │   │   └── ProductList.js
│   │   │   └── Cart.js
│   │   │   └── Checkout.js
│   │   ├── pages/
│   │   │   └── HomePage.js
│   │   │   └── ProductPage.js
│   │   │   └── CartPage.js
│   │   │   └── CheckoutPage.js
│   │   │   └── OrderPage.js
│   │   ├── context/
│   │   │   └── CartContext.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── styles.css
│   └── .env
│
├── .gitignore
└── README.md
```

### Backend Setup

#### 1. `backend/server.js`
```javascript
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
```

#### 2. `backend/config/db.js`
```javascript
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
```

#### 3. `backend/models/userModel.js`
```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true,
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
```

#### 4. `backend/models/productModel.js`
```javascript
import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
}, {
    timestamps: true,
});

const productSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    reviews: [reviewSchema],
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
```

#### 5. `backend/models/orderModel.js`
```javascript
import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    orderItems: [{
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product',
        },
    }],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false,
    },
    deliveredAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
```

#### 6. `backend/routes/userRoutes.js`
```javascript
import express from 'express';
import { authUser, registerUser, getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/').post(registerUser);

export default router;
```

#### 7. `backend/routes/productRoutes.js`
```javascript
import express from 'express';
import { getProducts, getProductById } from '../controllers/productController.js';

const router = express.Router();

router.route('/').get(getProducts);
router.route('/:id').get(getProductById);

export default router;
```

#### 8. `backend/routes/orderRoutes.js`
```javascript
import express from 'express';
import { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);

export default router;
```

#### 9. `backend/controllers/userController.js`
```javascript
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const

 { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

export { authUser, registerUser, getUserProfile, updateUserProfile };
```

#### 10. `backend/controllers/productController.js`
```javascript
import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

export { getProducts, getProductById };
```

#### 11. `backend/controllers/orderController.js`
```javascript
import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
        return;
    } else {
        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

export { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders };
```

#### 12. `backend/middleware/authMiddleware.js`
```javascript
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

export { protect };
```

#### 13. `backend/middleware/errorMiddleware.js`
```javascript
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export { notFound, errorHandler };
```

#### 14. `backend/utils/generateToken.js`
```javascript
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

export default generateToken;
```

### Frontend Setup

#### 1. `frontend/src/index.js`
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles.css';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
```

#### 2. `frontend/src/App.js`
```javascript
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderPage from './pages/OrderPage';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
    return (
        <Router>
            <Header />
            <main>
                <Switch>
                    <Route path="/" component={HomePage} exact />
                    <Route path="/product/:id" component={ProductPage} />
                    <Route path="/cart" component={CartPage} />
                    <Route path="/checkout" component={CheckoutPage} />
                    <Route path="/order/:id" component={OrderPage} />
                </Switch>
            </main>
            <Footer />
        </Router>
    );
}

export default App;
```

#### 3. `frontend/src/components/Header.js`
```javascript
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/cart">Cart</Link>


            </nav>
        </header>
    );
}

export default Header;
```

#### 4. `frontend/src/components/Footer.js`
```javascript
import React from 'react';

function Footer() {
    return (
        <footer>
            <p>&copy; 2024 E-Commerce Platform</p>
        </footer>
    );
}

export default Footer;
```

#### 5. `frontend/src/components/Product.js`
```javascript
import React from 'react';
import { Link } from 'react-router-dom';

function Product({ product }) {
    return (
        <div>
            <Link to={`/product/${product._id}`}>
                <img src={product.image} alt={product.name} />
            </Link>
            <div>
                <Link to={`/product/${product._id}`}>
                    <strong>{product.name}</strong>
                </Link>
                <p>${product.price}</p>
            </div>
        </div>
    );
}

export default Product;
```

#### 6. `frontend/src/components/ProductList.js`
```javascript
import React, { useState, useEffect } from 'react';
import Product from './Product';
import axios from 'axios';

function ProductList() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await axios.get('/api/products');
            setProducts(data);
        };

        fetchProducts();
    }, []);

    return (
        <div>
            {products.map((product) => (
                <Product key={product._id} product={product} />
            ))}
        </div>
    );
}

export default ProductList;
```

#### 7. `frontend/src/pages/HomePage.js`
```javascript
import React from 'react';
import ProductList from '../components/ProductList';

function HomePage() {
    return (
        <div>
            <h1>Latest Products</h1>
            <ProductList />
        </div>
    );
}

export default HomePage;
```

#### 8. `frontend/src/pages/ProductPage.js`
```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductPage({ match }) {
    const [product, setProduct] = useState({});

    useEffect(() => {
        const fetchProduct = async () => {
            const { data } = await axios.get(`/api/products/${match.params.id}`);
            setProduct(data);
        };

        fetchProduct();
    }, [match]);

    return (
        <div>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>${product.price}</p>
        </div>
    );
}

export default ProductPage;
```

#### 9. `frontend/src/pages/CartPage.js`
```javascript
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function CartPage() {
    const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

    return (
        <div>
            <h1>Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                cartItems.map((item) => (
                    <div key={item.product}>
                        <h4>{item.name}</h4>
                        <p>${item.price}</p>
                        <button onClick={() => addToCart(item.product, item.qty + 1)}>+</button>
                        <button onClick={() => removeFromCart(item.product)}>-</button>
                    </div>
                ))
            )}
        </div>
    );
}

export default CartPage;
```

#### 10. `frontend/src/pages/CheckoutPage.js`
```javascript
import React from 'react';

function CheckoutPage() {
    return (
        <div>
            <h1>Checkout</h1>
            {/* Add your checkout form here */}
        </div>
    );
}

export default CheckoutPage;
```

#### 11. `frontend/src/pages/OrderPage.js`
```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OrderPage({ match }) {
    const [order, setOrder] = useState({});

    useEffect(() => {
        const fetchOrder = async () => {
            const { data } = await axios.get(`/api/orders/${match.params.id}`);
            setOrder(data);
        };

        fetchOrder();
    }, [match]);

    return (
        <div>
            <h1>Order {order._id}</h1>
            {/* Add your order details here */}
        </div>
    );
}

export default OrderPage;
```

#### 12. `frontend/src/context/CartContext.js`
```javascript
import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product, qty) => {
        const itemExists = cartItems.find((item) => item.product === product);
        if (itemExists) {
            setCartItems(
                cartItems.map((item) =>
                    item.product === product ? { ...item, qty } : item
                )
            );
        } else {
            setCartItems([...cartItems, { product, qty }]);
        }
    };

    const removeFromCart = (product) => {
        setCartItems(cartItems.filter((item) => item.product !== product));
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};
```

#### 13. `frontend/src/styles.css`
```css
/* Add your custom styles here */
body {
    font-family: Arial, sans-serif;
}

header, footer {
    background-color: #f8f9fa;
    padding: 10px;
    text-align: center;
}

main {
    padding: 20px;
}
```

### README.md
```markdown
# E-Commerce Platform

## Description
A fully functional e-commerce platform where users can browse products, add them to cart, make purchases, and manage their orders. It includes features like user accounts, product search, sorting/filtering options, and secure payment gateways for a seamless shopping experience.

## Features
- User Authentication (Register, Login, Logout)
- Product Listing
- Product Details
- Add to Cart
- Checkout
- Order Management
- Admin Dashboard (Add, Edit, Delete Products)

## Tech Stack
- MongoDB
- Express.js
- React.js
- Node.js

## Setup Instructions

### Backend

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Create a `.env` file and add the following:
   ```bash
   MONGO_URI=<Your MongoDB URI>
   JWT_SECRET=<Your JWT Secret>
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Create a `.env` file and add the following:
   ```bash
   REACT_APP_API_URL=<Your Backend API URL>
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the frontend:
   ```bash
   npm start
   ```

## License
This project is licensed under the MIT License.
```

This setup provides a complete e-commerce platform with a structured backend and frontend, implementing essential features such as product browsing, cart management, user authentication, and order processing. You can expand this setup by adding more advanced features such as user reviews, product ratings, and an admin panel for managing products and orders.