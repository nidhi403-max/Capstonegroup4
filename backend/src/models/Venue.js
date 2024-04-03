const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
    name: String,
    capacity: Number,
    location: String,
    status: { type: String, enum: ['Booked', 'Open'], default: 'Open' },
    schedule: {type : Date, default:Date.now}
});
const Venue = mongoose.model('Venue', venueSchema);
module.exports = Venue;
