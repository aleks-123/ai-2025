const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

exports.init = async () => {
  try {
    await mongoose.connect(DB);
    console.log('Successfully connnected to database!');
  } catch (err) {
    console.log(err.message);
  }
};
