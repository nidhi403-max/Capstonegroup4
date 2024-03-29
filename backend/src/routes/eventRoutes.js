const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// CRUD 
router.get('/', eventController.getAllEvents);
router.post('/createevent', eventController.createEvent);


module.exports = router;
