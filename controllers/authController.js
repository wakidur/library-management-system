/**

/**
 * 3th party dependencies Modules from the npm .
 */
const Joi = require('joi');

// Own Middleware and dependency
const asyncHandler = require('../middleware/async-middleware');
const ErrorResponse = require('../utilities/error-response');
const MongooseQuery = require('../utilities/mongoose-query');
const Message = require('../utilities/message');

/**
 * Schema require list
 */
const User = require('../models/userModel');

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, req, res) => {
  // Create token
  const token = user.getSignedJwtToken();
  // cookieOptions
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.cookie('jwt', token, options);
  const userData = {
    id: user._id,
    phone: user.phone,
    uid: user.uid,
    role: user.role,
  };
  return res.status(statusCode).json({
    status: 'success',
    token,
    authData: userData,
  });
};

function endUserJoiSchema() {
  return Joi.object({
    phone: Joi.string().pattern(
      new RegExp(/(^([+]{1}[8]{2}|0088)?(01){1}[3-9]{1}\d{8})$/)
    ),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')),
  });
}

exports.signup = asyncHandler(async (req, res, next) => {
  // 1) check request body is empty!
  if (!req.body) {
    return next(new ErrorResponse(`${Message.RequestBodyIsEmpty}`, 400));
  }

  // 2) Create a schema is constructed using the provided types and constraints
  const UserJoiSchema = endUserJoiSchema();

  // 2.1) Validate check with request body
  // Validate request body by the JOI Schema
  const createtingUserObject = await UserJoiSchema.validateAsync(req.body);
  //  3) Find the User by phone.
  const findUserExist = await MongooseQuery.findOne(User, {
    phone: createtingUserObject.phone,
  });
  //  3.1) Find the User by phone exist or not
  if (findUserExist) {
    return next(new ErrorResponse('This phone number already exist', 400));
  }

  console.log(createtingUserObject);

  // const newUser = await MongooseQuery.create(User, createtingUserObject);
  const newUser = await MongooseQuery.create(User, createtingUserObject);

  sendTokenResponse(newUser, 201, req, res);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;

  // 1) Check if email and password exist
  if (!phone || !password) {
    return next(new ErrorResponse('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ phone }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new ErrorResponse('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  sendTokenResponse(user, 200, req, res);
});

exports.adminLogin = asyncHandler(async (req, res, next) => {
  const { uid, password } = req.body;

  // 1) Check if email and password exist
  if (!uid || !password) {
    return next(new ErrorResponse('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ uid }).select('+password');

  if (!user || !(await user.correctPassword(password))) {
    return next(new ErrorResponse('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  sendTokenResponse(user, 200, req, res);
});
