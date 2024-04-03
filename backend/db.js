const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://eventxo:nidz10@cluster0.bl5bixq.mongodb.net/';


const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = connectToMongoDB;

