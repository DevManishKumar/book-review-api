const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  getBook,
  createBook,
  searchBooks,
} = require('../controllers/bookController');
const auth = require('../middleware/auth');

router.get('/', auth, getAllBooks);
router.get('/search',auth, searchBooks);
router.get('/:id',auth, getBook);
router.post('/', auth, createBook);

module.exports = router;