const Review = require('../models/Review');
const Book = require('../models/Book');
const { NotFoundError, BadRequestError } = require('../errors/index');

const createReview = async (req, res) => {
  const { id: bookId } = req.params;
  const { userId } = req.user;
  const { rating, comment } = req.body;

  // Check if book exists
  const book = await Book.findById(bookId);
  if (!book) {
    throw new NotFoundError(`No book with id ${bookId}`);
  }

  // Check if user already reviewed this book
  const alreadyReviewed = await Review.findOne({
    book: bookId,
    user: userId,
  });

  if (alreadyReviewed) {
    throw new BadRequestError('You have already reviewed this book');
  }

  const review = await Review.create({
    rating,
    comment,
    book: bookId,
    user: userId,
  });

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: "Review created successfully",
    data: {
      review,
    },
  });
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { userId } = req.user;
  const { rating, comment } = req.body;

  const review = await Review.findOneAndUpdate(
    { _id: reviewId, user: userId },
    { rating, comment },
    { new: true, runValidators: true }
  );

  if (!review) {
    throw new NotFoundError(`No review with id ${reviewId}`);
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Review updated successfully",
    data: {
      review,
    },
  });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { userId } = req.user;

  const review = await Review.findOneAndDelete({
    _id: reviewId,
    user: userId,
  });

  if (!review) {
    throw new NotFoundError(`No review with id ${reviewId}`);
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Review deleted successfully",
  });
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
};