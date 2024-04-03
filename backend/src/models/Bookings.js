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
  status: {
    type: String,
    enum: ['Open', 'Review', 'Approved', 'Booked', 'Cancelled'],
    default: 'Open'
  },
  comment:{
    type:String,
    require:false
  },
  paymentId:{
    type:String,
    require:false,
  },
  pdfUrl:{
    type:String,
    require:false,
    default:"",
  },
  isEmailSend:{
    type:Boolean,
    require:false,
    default:false,
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
