const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
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
    required: [
      true,
      'Book request must belong to a single book or all books Request!',
    ],
    default: false,
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

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
