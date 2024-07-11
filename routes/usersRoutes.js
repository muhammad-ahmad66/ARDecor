const express = require('express');
const multer = require('multer');

const userController = require('../controllers/usersController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);
router.patch(
  '/updateMe',
  authController.protect,
  // userController.uploadUserPhoto,
  // userController.resizeUserPhoto,
  userController.updateMe,
);
router.delete('/deleteMe', authController.protect, userController.deleteMe);
router.get('/getMe', authController.protect, userController.getMe);

router
  .route('/cart')
  .get(authController.protect, userController.getUserCartDetails)
  .patch(authController.protect, userController.updateCart);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
