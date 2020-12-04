// Own Middleware and dependency
const asyncHandler = require('../middleware/async-middleware');
const ErrorResponse = require('../utilities/error-response');
const MongooseQuery = require('../utilities/mongoose-query');
const message = require('../utilities/message');

/**
 * Schema require list
 */
const RequestBook = require('../models/requestBookModel');
const Book = require('../models/bookModel');

exports.getRequestBooks = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: message.DATA_FETCH,
    data: {
      orders: res.advancedResults,
    },
  });
});

exports.getRequestBook = asyncHandler(async (req, res, next) => {
  const findRequestBook = await MongooseQuery.findByIdAndTwoPopulate(
    RequestBook,
    req.params.requestBookId,
    {
      path: 'user',
      select: 'bookName author releaseDate',
    },
    {
      path: 'book',
      select: 'name email role',
    }
  );

  if (!findRequestBook)
    return next(
      new ErrorResponse(
        `findRequestBook is not found with id of ${req.params.requestBookId}`,
        404
      )
    );

  res.status(200).send({
    status: 'success',
    message: message.PARTICULAR_DATA_FATCH,
    data: { requestBook: findRequestBook },
  });
});

exports.createRequestBook = asyncHandler(async (req, res, next) => {
  // 1) check request body is empty!
  if (!req.body) {
    return next(new ErrorResponse(`${message.RequestBodyIsEmpty}`, 400));
  }
  // 2)  object destructuring
  const { _id } = req.user;
  const { book, isRequestForAllBooks } = req.body;

  // 3) check   Is Request For All Books
  if (isRequestForAllBooks) {
    // 3.1 Find  all books are  already request for booking or not
    const isAlreadyBooks = MongooseQuery.findOne(RequestBook, {
      isRequestForAllBooks,
    });
    console.log(isAlreadyBooks);
    // 3.2) Books are already books untill requestExpiredIn
    if (
      isAlreadyBooks &&
      new Date(isAlreadyBooks.requestExpiredIn).getTime() > new Date().getTime()
    ) {
      return next(new ErrorResponse('All books are already request', 400));
    }
    // if all books are not request for any  user
    const allBooks = await MongooseQuery.find(Book, '_id');
  } else {
    await MongooseQuery.create(RequestBook, { book: book, user: _id });
  }

  res.status(201).json({
    status: 'success',
    message: 'New Order Created',
    data: {
      order: newOrder,
    },
  });
});
