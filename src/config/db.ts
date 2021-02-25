import mongoose from 'mongoose';
const db = process.env.DB_HOST;

const connectDB = async () => {
  try {
    if (!db) {
      throw Error('Database host is not defined')
    }

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

export default connectDB;
