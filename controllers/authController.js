const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

const sendEmail = async (email, subject, text) => {
  // Use nodemailer to send emails (configure your email service)
  // Example using Gmail:
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'fidelgeep@gmail.com',
      pass: 'Password123@',
    },
  });

  const mailOptions = {
    from: 'fidelgeep@gmail.com',
    to: email,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, 'your_secret_key', { expiresIn: '1h' });
};

  const authController = {
    signup: async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        const {
          companyName,
          email,
          registrationNumber,
          category,
          representativeFirstName,
          representativeLastName,
          password,
          role, // Include the role in the request body
        } = req.body;
  
        // Check if the user making the request is a super admin
        if (!req.user.isAdmin) {
          return res.status(403).json({ message: 'Permission denied' });
        }
  
        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'User with this email already exists' });
        }
  
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Create a new user with the specified role
        const newUser = new User({
          companyName,
          email,
          registrationNumber,
          category,
          repFirstName: representativeFirstName,
          repLastName: representativeLastName,
          password: hashedPassword,
          role, // Include the role
        });
  
        // Save the user to the database
        await newUser.save();
  
        res.status(201).json({ message: 'User created successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await User.findOne({ email });

      // Check if the user exists
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);

      // Check if the password is valid
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = generateToken(user._id);

      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      // Find the user by email
      const user = await User.findOne({ email });

      // Check if the user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Generate reset token
      const resetToken = generateToken(user._id);

      // Send reset email
      const resetLink = `http://your-frontend-app/reset-password/${resetToken}`;
      const emailText = `Click the following link to reset your password: ${resetLink}`;

      await sendEmail(email, 'Password Reset', emailText);

      res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      // Verify the token
      const decodedToken = jwt.verify(token, 'your_secret_key');

      // Find the user by ID
      const user = await User.findById(decodedToken.userId);

      // Check if the user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      // Check if the user making the request is a super admin
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Permission denied' });
      }

      // Get all users
      const users = await User.find({}, 'companyName email registrationNumber category representativeFirstName representativeLastName');

      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};

module.exports = authController;
