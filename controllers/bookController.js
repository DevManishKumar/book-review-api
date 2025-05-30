const Book = require('../models/Book');
const Review = require('../models/Review');
const { NotFoundError, BadRequestError } = require('../errors/index');

const getAllBooks = async (req, res) => {
  const { author, genre, page = 1, limit = 10 } = req.query;
  
  const query = {};
  if (author) query.author = { $regex: author, $options: 'i' };
  if (genre) query.genre = { $regex: genre, $options: 'i' };

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
  };

  const books = await Book.paginate(query, options);
  
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Books fetched successfully",
    data: books
  });
};

const getBook = async (req, res) => {
  const { id } = req.params;
  
  const book = await Book.findById(id);
  if (!book) {
    throw new NotFoundError(`No book with id ${id}`);
  }

  // Get reviews for the book with pagination
  const { page = 1, limit = 5 } = req.query;
  const reviews = await Review.find({ book: id })
    .populate('user', 'username')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Book details fetched successfully",
    data: {
      ...book.toObject(),
      reviews
    }
  });
};

const createBook = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const book = await Book.create(req.body);
  
  res.status(201).json({
    success: true,
    statusCode: 201,
    message: "Book created successfully",
    data: book
  });
};

const searchBooks = async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query;
  
  if (!query) {
    throw new BadRequestError('Please provide a search query');
  }

  const searchQuery = {
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { author: { $regex: query, $options: 'i' } },
    ],
  };

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
  };

  const books = await Book.paginate(searchQuery, options);
  
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Search results fetched successfully",
    data: books
  });
};

// Add this new controller for getting just the rating
const getBookRating = async (req, res) => {
  const { id } = req.params;
  
  const book = await Book.findById(id).select('title averageRating reviewCount');
  if (!book) {
    throw new NotFoundError(`No book with id ${id}`);
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Book rating fetched successfully",
    data: book
  });
};

module.exports = {
  getAllBooks,
  getBook,
  createBook,
  searchBooks,
  getBookRating
};