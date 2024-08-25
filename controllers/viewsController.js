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
  const queryString = req.query;
  const queryObj = { ...queryString };

  const { price } = req.query;

  // Check if a price filter is present
  if (price) {
    const priceParts = price.split('&');
    const minPrice = priceParts
      .find((part) => part.startsWith('gte'))
      .split('=')[1];
    const maxPrice = priceParts
      .find((part) => part.startsWith('lte'))
      .split('=')[1];

    if (minPrice && maxPrice) {
      queryObj.price = {
        $gte: Number(minPrice),
        $lte: Number(maxPrice),
      };
    }
  }

  try {
    const products = await Product.find(queryObj);

    res.status(200).render('products', {
      title: 'Products',
      page: 'products',
      products,
      queryString,
    });
  } catch (error) {
    next(error);
  }
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

exports.getAbout = (req, res, next) => {
  res.status(200).render('about', {
    title: 'About Us',
    page: 'about',
  });
};

exports.getAllProducts = async (req, res, next) => {
  const products = await Product.find();

  res.status(200).render('all-products', {
    title: 'All Products',
    page: 'allProducts',
    products,
  });
};

exports.getProductUpdateForm = async function (req, res, next) {
  try {
    const productId = req.body.productId;
    const product = await Product.findById(productId);
    res.status(200).render('updateProductForm', {
      title: 'Update Product',
      page: 'updateProductForm',
      product,
    });
    // Handle the update logic here
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.SearchProducts = async (req, res) => {
  try {
    const name = req.params.name.toLowerCase(); // Get the search query from the URL
    const products = await Product.find({
      $or: [
        { name: { $regex: name, $options: 'i' } },
        { description: { $regex: name, $options: 'i' } },
      ],
    });

    // Render the products (or send them as JSON)
    res.render('products', { products }); // Adjust as needed
  } catch (error) {
    res.status(500).send('Error occurred while fetching products');
  }
};
