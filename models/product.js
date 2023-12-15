const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  details: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  sold: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['expired', 'good'],
    default: 'good',
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
