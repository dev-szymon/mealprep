const mongoose = require('mongoose');
const db = process.env.DB_HOST;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log('mongoDB connected');
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = connectDB;
