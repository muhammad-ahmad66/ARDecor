const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const ordersController = require('../controllers/ordersController');

const router = express.Router();
router.post(
  '/update-product',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getProductUpdateForm,
);

router.get(
  '/all-products',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getAllProducts,
);

router.get('/upload-new-product', viewsController.getUploadNewProduct);
router.get(
  '/',
  ordersController.createOrderCheckout,
  authController.isLoggedIn,
  viewsController.getHome,
);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);

router.get('/products', authController.isLoggedIn, viewsController.getProducts);
router.get(
  '/product/:id',
  authController.isLoggedIn,
  viewsController.getProductDetails,
);

// STATIC PAGES
router.get('/contact', authController.isLoggedIn, viewsController.getContact);
router.get('/me', authController.protect, viewsController.getAccount);

router.get(
  '/search-product/:name',
  authController.protect,
  viewsController.SearchProducts,
);

module.exports = router;
