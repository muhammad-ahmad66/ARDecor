const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      'chairs',
      'tables',
      'computer-desk',
      'sofa',
      'study-table',
      'cabinet',
    ], // Restrict category to specific values
  },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
