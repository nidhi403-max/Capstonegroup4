const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  date: Date,
  imageUrls: [String],
  price:{
    type:Number,
    require:true,
  }
 
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
