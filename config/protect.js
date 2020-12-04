/**
 * Node Core Modules
 */
const { promisify } = require('util');
/**
 * 3rd party modules from npm.
 */
const jwt = require('jsonwebtoken');

const ErrorResponse = require('../utilities/error-response');
const User = require('../models/userModel');
const asyncHandler = require('../middleware/async-middleware');
const mongooseQuery = require('../utilities/mongoose-query');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  // Don't using Bearer token
  // token = req.headers['authorization'];
  if (
    ['authorization'] in req.headers &&
    !req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization;
  // Set token from Bearer token in header
  // token = req.headers['authorization'].split(' ')[1];
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];
  // Set token from cookie
  else if (req.cookies.jwt) token = req.cookies.jwt;

  // Make sure token exists
  if (!token) {
    return next(
      new ErrorResponse(
        'You are not logged in! Please log in to get access.',
        401
      )
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await mongooseQuery.findOne(User, { _id: decoded.id });

  if (!currentUser) {
    return next(
      new ErrorResponse(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});
