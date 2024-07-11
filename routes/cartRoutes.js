const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const authController = require("../controllers/authController");

// Use the protect middleware to ensure the user is authenticated
router.use(authController.protect);

// Add product to cart
router.post("/add", cartController.addToCart);

// Update cart item quantity
router.patch("/update/:productId", cartController.updateCartItem);

// Remove product from cart
router.delete("/remove/:productId", cartController.removeCartItem);

module.exports = router;
