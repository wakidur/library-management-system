// Import the mongoose module
const mongoose = require('mongoose');

/**
 * Connect to MongoDB.
 */
const connectDB = async () => {
  // Set up default mongoose connection
  const mongoDBLocalHostUri = process.env.MONGO_URI;

  mongoose.connect(mongoDBLocalHostUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    keepAlive: 1,
  });

  // Get Mongoose to use the global promise library
  mongoose.Promise = global.Promise;
  mongoose.connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
  });

  mongoose.connection.on('error', (err) => {
    console.log(`Could not connect to the database. Exiting now... ${err}`);
    process.exit();
  });
};

module.exports = connectDB;
