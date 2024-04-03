const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// CRUD 
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser); // Update 
router.delete('/:id', userController.deleteUser); // Delete 
router.post('/signup',userController.signup);
router.post('/login',userController.login);


module.exports = router;
