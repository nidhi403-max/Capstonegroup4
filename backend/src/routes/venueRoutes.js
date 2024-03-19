const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');

// CRUD 
router.get('/', venueController.getAllVenues);
router.post('/', venueController.createVenue);
router.put('/:id', venueController.updateVenue); // Update 
router.delete('/:id', venueController.deleteVenue); // Delete 

module.exports = router;
