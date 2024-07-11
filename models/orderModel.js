const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a user.'],
  },
  products: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Order must belong to any product.'],
      },

      quantity: { type: Number, required: true },
    },
  ],
  total_price: { type: Number, required: [true, 'Order must have a price.'] },
  order_date: { type: Date, default: Date.now },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'shipped', 'delivered'],
    default: 'pending',
  },
});

orderSchema.pre('/^find', function (next) {
  this.populate('user_id').populate({
    path: 'products.product_id',
    select: 'name price',
  });
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
