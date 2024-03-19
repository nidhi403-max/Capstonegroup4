
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
    type: String,
    required: false 
  },
  firstname: {
    type: String,
    required: false 
  }, 
   lastname: {
    type: String,
    required: false 
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  userCreateDate: {
    type: Date,
    default: Date.now
  },
  phone: {
    type: String,
    required: false
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
