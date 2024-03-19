const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');

// CRUD 
router.get('/', packageController.getAllPackages);
router.post('/', packageController.createPackage);
router.put('/:id', packageController.updatePackage); // Update
router.delete('/:id', packageController.deletePackage); // Delete
module.exports = router;
