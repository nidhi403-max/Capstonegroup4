const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// CRUD 
router.get('/', eventController.getAllEvents);
router.post('/createevent', eventController.createEvent);
router.put('/updateevent/:id', eventController.updateEvent); 
router.delete('/deleteevent/:id', eventController.deleteEvent); 

module.exports = router;
