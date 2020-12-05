/**
 * 3rd party modules from npm.
 */
const cloudinary = require('cloudinary').v2;
const Joi = require('joi');

// Own Middleware and dependency
const asyncHandler = require('../middleware/async-middleware');
const ErrorResponse = require('../utilities/error-response');
const mongooseQuery = require('../utilities/mongoose-query');
const Message = require('../utilities/message');
const { isMongoDBObjectID } = require('../service/utilityService');
/**
 * Schema require list
 */
const Book = require('../models/bookModel');
// cloudinary config init
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// book Joi Schem Init
const bookJoiSchemInit = Joi.object({
  bookName: Joi.string().min(1).max(150).required(),
  author: Joi.string().required(),
  releaseDate: Joi.date().required(),
  genre: Joi.string().required(),
});

// book Init
const bookInit = (req) => {
  return {
    bookName: req.body.bookName,
    releaseDate: new Date(req.body.releaseDate),
    author: req.body.author,
    genre: req.body.genre,
  };
};

// Remove book field name for update state
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getBooks = asyncHandler(async (req, res, next) => {
  // Support Search
  const { keyWord } = req.query;
  if (keyWord) {
    const searchItem = keyWord
      ? { bookName: { $regex: keyWord, $options: 'i' } }
      : {};

    const searchBook = await mongooseQuery.find(Book, searchItem);

    res.status(200).json({
      status: 'success',
      message: Message.DATA_FETCH,
      data: {
        books: searchBook,
        count: searchBook.length,
      },
    });
  } else {
    res.status(200).json({
      status: 'success',
      message: Message.DATA_FETCH,
      data: {
        books: res.advancedResults,
      },
    });
  }
});

exports.getBook = asyncHandler(async (req, res, next) => {
  // 1) Check request parameter is valid mongodb id or not
  const isValidID = await isMongoDBObjectID(req.params.bookId);
  // 1.1) It isn't valid mongodb id
  if (!isValidID) {
    return next(new ErrorResponse(`${Message.THIS_IN_VALID_MONGODB_ID}`, 400));
  }
  // 2) Find Particular book id
  const book = await mongooseQuery.findById(Book, req.params.bookId);
  // 2.1) This book id is not found
  if (!book)
    return next(
      new ErrorResponse(
        `Book is not found with id of ${req.params.bookId}`,
        404
      )
    );
  // 3) Final output
  res.status(200).json({
    status: 'success',
    message: Message.PARTICULAR_DATA_FATCH,
    data: { book },
  });
});

exports.createBook = asyncHandler(async (req, res, next) => {
  // 1) check request body is empty!
  console.log(req.body);
  if (!req.body) {
    return next(new ErrorResponse(`${Message.RequestBodyIsEmpty}`, 400));
  }

  // 2) Create a schema is constructed using the provided types and constraints
  const BookJoiSchema = bookJoiSchemInit;

  // 2.1) Validate check with request body
  // Validate request body by the JOI Schema
  const createtingBookObj = await BookJoiSchema.validateAsync(req.body);

  //  3) Find the User by phone.
  const findBookExist = await mongooseQuery.findOne(Book, {
    bookName: createtingBookObj.bookName,
  });

  //  3.1) Find the User by email exist or not
  if (findBookExist) {
    return next(new ErrorResponse('This Book Name address already exist', 400));
  }
  // 4) Check files
  if (!req.files) return next(new ErrorResponse('Please add a photo', 400));

  const file = req.files.bookImage;

  // 4.1) Check file type
  if (!file.mimetype.startsWith('image'))
    return next(new ErrorResponse('This file is not supported', 400));

  // 4.2) Check file size
  if (file.size > process.env.FILE_UPLOAD_SIZE)
    return next(
      new ErrorResponse(
        `Please upload a image of size less than ${process.env.FILE_UPLOAD_SIZE}`,
        400
      )
    );
  // 5) Convet request body for date convertion
  const bookObj = bookInit(req);
  // 5.1)  object destructuring
  const { _id } = req.user;
  // 6) Save Image on Cloud and get url
  cloudinary.uploader.upload(
    file.tempFilePath,
    {
      resource_type: 'image',
      use_filename: true,
      folder: 'books',
      eager: [
        {
          width: 500,
          height: 500,
          crop: 'fill',
        },
      ],
      eager_async: true,
    },
    async function (error, result) {
      if (error) return next(new ErrorResponse('failed to create book', 409));
      const book = await mongooseQuery.create(Book, {
        ...bookObj,
        bookImage: result.eager[0].url,
        creatorId: _id,
      });
      res.status(201).json({
        status: 'success',
        message: Message.CREATE_SUCCESSFUL,
        data: { book },
      });
    }
  );
});

exports.updateBook = asyncHandler(async (req, res, next) => {
  let updateBook = {};
  // 1) Check is it valid mongo id
  const isValidID = await isMongoDBObjectID(req.params.bookId);
  if (!isValidID) {
    return next(new ErrorResponse(`${Message.THIS_IN_VALID_MONGODB_ID}`, 400));
  }
  // 2) check request body is empty!
  if (!req.body) {
    return next(new ErrorResponse(`${Message.RequestBodyIsEmpty}`, 400));
  }

  // 3) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'author',
    'genre',
    'releaseDate',
    'isBookActive'
  );

  // 3.1) ternary operator for converting date object
  filteredBody.releaseDate
    ? (filteredBody.releaseDate = new Date(filteredBody.releaseDate))
    : null;
  // 3.2) Check releaseDate is updatable or not
  if (filteredBody.releaseDate) updateBook = filteredBody;
  else updateBook = filteredBody;

  // 4) Find by Id and Update Particular Book
  const editBook = await mongooseQuery.findByIdAndUpdate(
    Book,
    req.params.bookId,
    updateBook,
    {
      new: true,
      runValidators: true,
    }
  );
  // 4.1 ) This id on found
  if (!editBook)
    return next(
      new ErrorResponse(
        `Book is not found with id of ${req.params.bookId}`,
        404
      )
    );
  // Success
  res.status(201).json({
    status: 'success',
    message: Message.UPDATE_PARTICULAR_DOCUMENT,
    data: { update: editBook },
  });
});

exports.deleteBookt = asyncHandler(async (req, res, next) => {
  const deleteBook = await mongooseQuery.findByIdAndDelete(
    Book,
    req.params.bookId
  );

  if (!deleteBook)
    return next(
      new ErrorResponse(
        `Book is not found with id of ${req.params.bookId}`,
        404
      )
    );

  return res.status(200).json({
    status: 'success',
    message: Message.DELETE_PARTICULAR_DOCUMENT,
    data: null,
  });
});
