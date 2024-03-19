const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
    name: String,
    capacity: Number,
    location: String,
});

module.exports = mongoose.model('Venue', venueSchema);