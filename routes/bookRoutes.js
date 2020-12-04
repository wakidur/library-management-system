const router = require('express').Router();
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBookt,
} = require('../controllers/bookController');

//Invoked middleware.
const advanceResults = require('../middleware/advancedResults');
const { protect } = require('../config/protect');
const { authorize } = require('../config/authorization');

// Book model
const Book = require('../models/bookModel');

router.use(protect);

router
  .route('/')
  .get(advanceResults(Book), getBooks)
  .post(authorize('librarian'), createBook);

router
  .route('/:bookId')
  .get(authorize('librarian'), getBook)
  .put(authorize('librarian'), updateBook)
  .delete(authorize('librarian'), deleteBookt);

module.exports = router;
