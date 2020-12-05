const router = require('express').Router();
const {
  getRequestBooks,
  getRequestBook,
  createRequestBook,
} = require('../controllers/requestForBookController');

//Invoked middleware.
const advanceResults = require('../middleware/advancedResults');
const { protect } = require('../config/protect');
const { authorize } = require('../config/authorization');

// requestBook model
const RequestBook = require('../models/requestForBookModel');

router.use(protect);

router
  .route('/')
  .get(
    authorize('librarian'),
    advanceResults(RequestBook, [
      {
        path: 'book',
        select: 'bookName author releaseDate',
      },
      {
        path: 'user',
        select: 'name email role',
      },
    ]),
    getRequestBooks
  )
  .post(authorize('student'), createRequestBook);

router
  .route('/:requestBookId')
  .get(authorize('student', 'librarian'), getRequestBook);

module.exports = router;
