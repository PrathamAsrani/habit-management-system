const express = require('express');
const router = express.Router();
const { getUserDataController, createUserController, loginController, updateUserProfileController } = require('../Controllers/authController.js');

// Get user details
router.get(`/getUser/:user_id`, getUserDataController);

// Add user
router.post(`/createUser`, createUserController);

// Login route
router.post(`/login`, loginController);

// Update user details
router.put(`/updateUser`, updateUserProfileController);

module.exports = router;
