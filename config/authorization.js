/**
 * Own modules.
 */

const ErrorResponse = require('../utilities/error-response');

// Static role based access control
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          'You do not have permission to perform this action',
          403
        )
      );
    }

    next();
  };
};
