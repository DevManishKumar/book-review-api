const express = require('express');
const router = express.Router();
const {
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.post('/books/:id/reviews', auth, createReview);
router.put('/reviews/:id', auth, updateReview);
router.delete('/reviews/:id', auth, deleteReview);

module.exports = router;