const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  companyName: String,
  email: String,
  registrationNumber: String,
  category: String,
  repFirstName: String,
  repLastName: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
  role: { type: String, enum: ['superAdmin', 'admin', 'user'], default: 'user' },
});

module.exports = mongoose.model('User', userSchema);
