const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  venueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    required: true
  },
  eventDate: {
    type: Date,
    default: Date.now
  },
  decorationPackage:{
    type:String,
    require:false
  },
  specialRequests:{
    type:String,
    require:false
  },
  accommodations:{
    type:[String],
    require:false
  },

  totalPrice: Number,
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
