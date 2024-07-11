const express = require('express');

const ordersController = require('../controllers/ordersController');
const authController = require('../controllers/authController');

const router = express.Router();
// Define routes for orders
router.get(
  '/checkout-session',
  authController.protect,
  ordersController.getCheckoutSession,
);
// router.get("/", ordersController.getAllOrders);
// router.get("/:id", ordersController.getOrderById);
// router.post("/", ordersController.createOrder);
// router.put("/:id", ordersController.updateOrder);
// router.delete("/:id", ordersController.deleteOrder);

module.exports = router;
