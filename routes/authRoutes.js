const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Signup
router.post('/signup', authController.signup);

// Login
router.post('/login', authController.login);

// Forgot Password
router.post('/forgot-password', authController.forgotPassword);

// Reset Password
router.post('/reset-password/:token', authController.resetPassword);

// Get All Users
router.get('/users', authController.getAllUsers);

module.exports = router;
