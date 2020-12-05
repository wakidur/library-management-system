const mongoose = require('mongoose');

function addDays(dateObj, numDays) {
  return dateObj.setDate(dateObj.getDate() + numDays);
}
const RequestForBookSchema = new mongoose.Schema({
  book: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Book',
      required: [true, 'Request Book must belong to a book!'],
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Request Book must belong to a User!'],
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
RequestForBookSchema.pre('save', function (next) {
  this.requestExpiredIn = addDays(new Date(), 5);
  next();
});

module.exports = mongoose.model('RequetForBook', RequestForBookSchema);
