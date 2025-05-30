const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a book title'],
    trim: true,
    maxlength: 100,
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name'],
    trim: true,
    maxlength: 50,
  },
  genre: {
    type: String,
    required: [true, 'Please provide a genre'],
    trim: true,
    maxlength: 30,
  },
  publishedYear: {
    type: Number,
    min: 1000,
    max: new Date().getFullYear(),
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
    set: val => Math.round(val * 10) / 10 
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

BookSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Book', BookSchema);