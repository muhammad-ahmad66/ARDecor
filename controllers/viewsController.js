// const Person = require("../models/personModel");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { AsyncCompiler } = require('sass');
const User = require('../models/userModel');
const Product = require('../models/productModel');

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account',
    page: 'login',
  });
});

exports.getSignupForm = catchAsync(async (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Sign up to your account',
    page: 'signup',
  });
});

exports.getHome = (req, res, next) => {
  res.status(200).render('home', {
    title: 'Home',
    page: 'home',
  });
};

exports.getUploadNewProduct = (req, res, next) => {
  res.status(200).render('uploadProductForm', {
    title: 'Upload New Product',
    page: 'uploadProductForm',
  });
};

exports.getProducts = async (req, res, next) => {
  const products = await Product.find();

  res.status(200).render('products', {
    title: 'Products',
    page: 'products',
    products,
  });
};

exports.getProductDetails = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError('Product not found!!', 404));
  }

  res.status(200).render('productDetails', {
    title: product.name,
    page: 'productDetails',
    product,
  });
});

exports.getAccount = async (req, res, next) => {
  req.params.id = req.user.id;

  let query = User.findById(req.params.id).populate([
    {
      path: 'orders',
      populate: {
        path: 'products.product_id',
        select: 'name description price image',
      },
    },
  ]);

  const doc = await query;
  // console.log('Document full: ', doc);
  // console.log('Products: ', doc.orders[0].products);

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).render('dashboard', {
    title: 'Your account',
    user: doc,
  });
};

// STATIC PAGES

exports.getContact = (req, res, next) => {
  res.status(200).render('contact', {
    title: 'Contact Us',
    page: 'contact',
  });
};
