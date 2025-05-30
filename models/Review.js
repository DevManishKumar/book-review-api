const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  book: {
    type: mongoose.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

// Prevent user from submitting more than one review per book
ReviewSchema.index({ book: 1, user: 1 }, { unique: true });

// Static method to get average rating of a book
ReviewSchema.statics.getRating = async function (bookId) {
  const result = await this.aggregate([
    { $match: { book: bookId } },
    {
      $group: {
        _id: '$book',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  try {
    await mongoose.model('Book').findByIdAndUpdate(bookId, {
      averageRating: result[0]?.averageRating || 0,
      reviewCount: result[0]?.reviewCount || 0,
    });
  } catch (error) {
    console.error('Error updating book rating:', error);
  }
};

// Update book's average rating after saving a review
ReviewSchema.post('save', async function() {
  await this.constructor.getRating(this.book);
});

// Update book's average rating after removing a review
ReviewSchema.post('remove', async function() {
  await this.constructor.getRating(this.book);
});

module.exports = mongoose.model('Review', ReviewSchema);