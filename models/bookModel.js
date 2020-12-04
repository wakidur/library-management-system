/**
 * 3rd party modules from npm.
 */
const mongoose = require('mongoose');
const slugify = require('slugify');

const BookSchema = new new mongoose.Schema({
  bookName: {
    type: String,
    required: [true, 'A book must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A book name must have less or equal then 50 characters'],
    minlength: [3, 'A book name must have more or equal then 3 characters'],
    // validate: [validator.isAlpha, 'Tour name must only contain characters']
  },
  slug: String,
  author: {
    type: String,
    required: [true, 'Please tell us author name!'],
  },
  bookImage: {
    type: String,
    required: false,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  genre: {
    type: String,
    required: false,
  },
  isBookActive: {
    type: Boolean,
    default: true,
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
})();

// Index it will help to search books
BookSchema.index({ bookName: 1 });
BookSchema.index({ slug: 1 });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
BookSchema.pre('save', function (next) {
  this.slug = slugify(this.bookName, { lower: true });
  next();
});

// Export model.
module.exports = mongoose.model('Book', BookSchema);
