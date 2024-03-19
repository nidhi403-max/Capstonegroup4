const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// CRUD 
 router.get('/', bookingController.getAllEvents);
router.post('/bookevent', bookingController.createBooking);


module.exports = router;
