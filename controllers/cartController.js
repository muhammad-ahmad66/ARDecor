const catchAsync = require("../utils/catchAsync");
const Product = require("../models/productModel");
const User = require("../models/userModel");

exports.addToCart = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { productId, quantity } = req.body;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Check if product is already in cart
  const cartItem = user.cart.find(
    (item) => item.product_id.toString() === productId
  );
  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    user.cart.push({ product_id: productId, quantity });
  }

  await user.save({ validateBeforeSave: false });
  res.status(200).json({ message: "Product added to cart", cart: user.cart });
});

// HANDLER TO UPDATE CART
exports.updateCartItem = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { productId } = req.params;
  const { quantity } = req.body;

  const cartItem = user.cart.find(
    (item) => item.product_id.toString() === productId
  );
  if (!cartItem) {
    return res.status(404).json({ message: "Product not found in cart" });
  }

  cartItem.quantity = quantity;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ message: "Cart updated", cart: user.cart });

  // res.status(200).render("cart", {
  //   title: "your cart",
  //   cart: user.cart,
  //   page: "cart",
  // });
});

// HANDLER TO REMOVE CART ITEM
exports.removeCartItem = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { productId } = req.params;

  user.cart = user.cart.filter(
    (item) => item.product_id.toString() !== productId
  );
  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json({ message: "Product removed from cart", cart: user.cart });
});
