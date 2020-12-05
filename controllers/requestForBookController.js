// Own Middleware and dependency
const asyncHandler = require('../middleware/async-middleware');
const ErrorResponse = require('../utilities/error-response');
const MongooseQuery = require('../utilities/mongoose-query');
const message = require('../utilities/message');
const { isMongoDBObjectID } = require('../service/utilityService');
/**
 * Schema require list
 */
const RequestBook = require('../models/requestForBookModel');
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
      select: 'name email role',
    },
    {
      path: 'book',
      select: 'bookName author releaseDate',
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

  /**
   * Registered students can request for all books
   * Registered students can request for a single book
   */
  // 3) check Is Request For All Books
  if (isRequestForAllBooks) {
    // Registered students can request for all books

    // 3.1 Find all books are already request for booking or not
    const isAllBooksBooking = await MongooseQuery.findOne(RequestBook, {
      isRequestForAllBooks,
    });
    // 3.2) Books are already books untill requestExpiredIn
    if (
      isAllBooksBooking &&
      new Date(isAllBooksBooking.requestExpiredIn).getTime() >
        new Date().getTime()
    ) {
      return next(new ErrorResponse('All books are already request', 400));
    }
    // Find particular book is request or not
    const allBooks = await MongooseQuery.find(Book, {});
    if (allBooks) {
      // create promises request
      const booksPromises = allBooks.map(
        async (item) =>
          await MongooseQuery.findOne(RequestBook, {
            book: { $in: [item._id] },
          })
      );
      // create promises all request
      const booksAlreadyRequested = await Promise.all(booksPromises);
      if (
        booksAlreadyRequested &&
        !booksAlreadyRequested.every((element) => element === null)
      ) {
        const filterObj = booksAlreadyRequested.filter(
          (e) =>
            e && new Date(e.requestExpiredIn).getTime() > new Date().getTime()
        );
        if (filterObj && filterObj.length)
          return next(new ErrorResponse('Few books are already request', 400));
      }
    }

    // If any of books are not book untill now
    const booksId = [];
    allBooks.forEach((book) => {
      booksId.push(book._id);
    });
    console.log(booksId);

    // Finaly create single book request

    const a = await MongooseQuery.create(RequestBook, {
      book: booksId,
      isRequestForAllBooks,
      user: _id,
    });

    console.log(a);

    res.status(201).json({
      status: 'success',
      message: message.CREATE_SUCCESSFUL,
      data: {
        books: a,
      },
    });
  } else if (book && !isRequestForAllBooks) {
    /**
     * Registered students can request for a single book
     */
    // 1) Check is it valid mongodb id
    const isValidID = await isMongoDBObjectID(book);
    if (!isValidID) {
      return next(
        new ErrorResponse(`${message.THIS_IN_VALID_MONGODB_ID}`, 400)
      );
    }
    // 2) Find Particular book id with in RequestBook to ensure this book already book or not
    // RequestBook.findOne({ book: { "$in" : [bookId]} }, ...);
    const bookFind = await MongooseQuery.findOne(RequestBook, {
      book: { $in: [book] },
    });
    // 2.1) This book id is found and ExpiredIn is not out so new studer or exsist studen can not book this books until expiredIn outdate
    if (
      bookFind &&
      new Date(bookFind.requestExpiredIn).getTime() > new Date().getTime()
    )
      return next(new ErrorResponse('This Book is already booking', 404));
    // Finaly create single book request
    await MongooseQuery.create(RequestBook, { book, user: _id });
    res.status(201).json({
      status: 'success',
      message: message.CREATE_SUCCESSFUL,
      data: null,
    });
  }
});
