const router = require('express').Router();
const {
  getRequestBooks,
  getRequestBook,
  createRequestBook,
} = require('../controllers/requetBookController');

//Invoked middleware.
const advanceResults = require('../middleware/advancedResults');
const { protect } = require('../config/protect');
const { authorize } = require('../config/authorization');

// requestBook model
const RequestBook = require('../models/requestBookModel');

router.use(protect);

router
  .route('/')
  .get(advanceResults(RequestBook), getRequestBooks)
  .post(authorize('student'), createRequestBook);

router.route('/:requestBookId').get(getRequestBook);

module.exports = router;
