const stripe = require('stripe')(
  'sk_test_51PMc9YSAr4IGzYowTNrFvh5QIrWDGLJwgRiZ7DaYKN6l28KuOOJN0TrG0CMDKzULZCQyhpx8VliwTBCQJEPauXFi00KDeWoaqi',
);
const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const User = require('./../models/userModel');
const Product = require('./../models/productModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the current user with the Cart
  const user = await User.findById(req.user.id).populate({
    path: 'cart.product_id',
    select: 'name description price image',
  });

  if (!user || user.cart.length === 0) {
    return next(new AppError('No items in your cart', 400));
  }

  // 2. Create the line items for Stripe checkout
  const line_items = user.cart.map((item) => ({
    price_data: {
      currency: 'pkr',
      product_data: {
        name: item.product_id.name,
        description: item.product_id.description,
        images: [
          `${req.protocol}://${req.get('host')}/img/products/${item.product_id.image}`,
        ],
      },
      unit_amount: item.product_id.price * 100, // Stripe amount is in cents
    },
    quantity: item.quantity,
  }));

  // 3) Calculate the total price
  const totalPrice = user.cart
    .reduce((total, item) => total + item.product_id.price * item.quantity, 0)
    .toFixed(2);

  // Serialize products array into query string
  const productsQueryString = user.cart
    .map(
      (item) => `product_id=${item.product_id._id}&quantity=${item.quantity}`,
    )
    .join('&');

  // 4) Create the Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/?user=${req.user._id}&totalPrice=${totalPrice}&${productsQueryString}`,
    cancel_url: `${req.protocol}://${req.get('host')}/users/cart`,
    customer_email: req.user.email,
    // client_reference_id: req.params.cartId,
  });

  // 5) Create Session as Response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createOrderCheckout = catchAsync(async (req, res, next) => {
  const { user, totalPrice, ...rest } = req.query;

  if (!user && !totalPrice) {
    return next();
  }

  // Extract product details from query string
  const products = [];
  const queryKeys = Object.keys(rest);
  for (let i = 0; i < queryKeys.length; i += 2) {
    const product_id = rest[queryKeys[i]];
    const quantity = parseInt(rest[queryKeys[i + 1]], 10);

    if (!mongoose.Types.ObjectId.isValid(product_id)) {
      return next(new AppError(`Invalid product ID: ${product_id}`, 400));
    }

    if (isNaN(quantity) || quantity <= 0) {
      return next(
        new AppError(`Invalid quantity for product ID ${product_id}`, 400),
      );
    }

    // Fetch product details from the database
    const product = await Product.findById(product_id).select(
      'name description image',
    );
    if (!product) {
      return next(new AppError(`Product not found: ${product_id}`, 404));
    }

    products.push({
      product_id,
      name: product.name,
      description: product.description,
      image: product.image,
      quantity,
    });
  }

  if (products.length === 0) {
    return next(new AppError('No valid products provided', 400));
  }

  // Create the order
  const order = await Order.create({
    user_id: user,
    products,
    total_price: totalPrice,
  });

  // Update the user's orders array
  await User.findByIdAndUpdate(user, { $push: { orders: order._id } });

  // Redirect to the home page, removing the query string
  res.redirect(req.originalUrl.split('?')[0]);
});

// Create a new order
exports.createOrder = async (req, res) => {
  const order = new Order({
    user_id: req.body.user_id,
    products: req.body.products,
    total_price: req.body.total_price,
    status: req.body.status,
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
