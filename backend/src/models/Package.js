const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    name: String,
    price: Number,
});

module.exports = mongoose.model('Package', packageSchema);