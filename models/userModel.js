/**
 * Node Core Modules
 */
const crypto = require('crypto');

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
      required: [false, 'Please add a name'],
      trim: false,
    },
    uid: {
      type: String,
    },
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: [true, "Password can't be empty"],
      minlength: [6, 'Password must be atleast 6 character long'],
      select: false,
    },
    photo: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      maxlength: [20, 'Phone number can not be longer than 20 characters'],
      required: false,
    },
    role: {
      type: String,
      default: 'user',
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
UserSchema.index({ phone: 1 });
// Document Middleware: runs before .save() and .create().
// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

UserSchema.pre('remove', async function (next) {
  await this.model('Order').deleteMany({ userId: this._id });

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

// Create Password Reset Token (Use this methods forgotPassword controller )
UserSchema.methods.createPasswordResetToken = function () {
  // User get this resetToken
  const resetToken = crypto.randomBytes(32).toString('hex');
  // but password reset token will be again encrypt because for security10 reason
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minute timer
  return resetToken;
};

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
      phone: this.phone,
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
