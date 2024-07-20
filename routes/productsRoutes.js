const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const authController = require('../controllers/authController');

// Define routes for products
router.get('/', authController.protect, productsController.getAllProducts);
router.get('/:id', authController.protect, productsController.getProduct);
router.post(
  '/',
  authController.protect,
  authController.restrictTo('admin'),
  productsController.uploadProductFile,
  productsController.saveProductFile,
  productsController.createProduct,
);
router.patch(
  '/:id',
  authController.protect,
  authController.restrictTo('admin'),
  // productsController.uploadProductFile,
  // productsController.saveProductFile,
  productsController.updateProduct,
);
router.delete(
  '/:id',
  authController.protect,
  authController.restrictTo('admin'),
  productsController.deleteProduct,
);

module.exports = router;
