const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema({
  title: {
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
  rating: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  imgUrl: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const OrderSchema = new mongoose.Schema({
items: {
    type: [itemSchema],
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
},{timestamps:true})

const BookOrder = mongoose.model('BookOrder', OrderSchema)

module.exports = BookOrder;


