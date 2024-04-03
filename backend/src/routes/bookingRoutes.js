const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// CRUD 
 router.get('/', bookingController.getAllEvents);
 router.get('/:id', bookingController.getEventById);
router.post('/bookevent', bookingController.createBooking);
router.post('/updateStatus/:id',bookingController.updateStatus)
router.post('/create-payment-intent',bookingController.makePayment)

module.exports = router;
