const mongoose = require('mongoose');

function addDays(dateObj, numDays) {
  return dateObj.setDate(dateObj.getDate() + numDays);
}
const RequestBookSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book',
    required: false,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!'],
  },
  isRequestForAllBooks: {
    type: Boolean,
    required: false,
    default: false,
  },

  requestExpiredIn: {
    type: Date,
    required: false,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
RequestBookSchema.pre('save', function (next) {
  this.requestExpiredIn = addDays(new Date(), 5);
  next();
});

module.exports = mongoose.model('RequetBook', RequestBookSchema);
