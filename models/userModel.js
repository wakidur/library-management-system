/**
 * 3rd party modules from npm.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: false,
      trim: true,
      maxlength: [150, 'A  name must have less or equal then 105 characters'],
      minlength: [1, 'A  name must have more or equal then 1 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      index: true,
      unique: true,
      dropDups: true,
      lowercase: true,
      // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
      match: [
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please enter a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, "Password can't be empty"],
      minlength: [6, 'Password must be atleast 6 character long'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
    },
    photo: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: {
        values: ['student', 'librarian'],
        message: 'Role is either: student, librarian',
      },
      default: 'student',
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
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Schema Index
UserSchema.index({ name: 1 });
UserSchema.index({ email: 1 });
// Document Middleware: runs before .save() and .create().
// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// Match user entered password to hashed password in database
UserSchema.methods.validPassword = function (enteredPassword) {
  // Synchronously tests a string against a hash.
  return bcrypt.compareSync(enteredPassword, this.password);
};
// Match user entered password to hashed password in database
UserSchema.methods.correctPassword = async function (candidatePassword) {
  // Asynchronously compares the given data against the given hash.
  return await bcrypt.compare(candidatePassword, this.password);
};

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIREIN,
    }
  );
};

// UserSchema.set('validateBeforeSave', false);
// Export function to create "SomeModel" model class
module.exports = mongoose.model('User', UserSchema);
