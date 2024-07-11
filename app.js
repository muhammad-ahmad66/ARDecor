const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const productsRoutes = require('./routes/productsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const ordersRoutes = require('./routes/ordersRoutes');
const viewsRoutes = require('./routes/viewsRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();

app.use(cors());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.urlencoded({ extended: true, limit: '10kb' })); // to parse data from url, sending through form
app.use(cookieParser()); // To parse cookies from incoming request.
app.use(express.json()); // To parse data from req.body -called body parser

// 3) ROUTES
// Import routes

// Use routes
app.use('/', viewsRoutes);
app.use('/products', productsRoutes);
app.use('/users', usersRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);

// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
