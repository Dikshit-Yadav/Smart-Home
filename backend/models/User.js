const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  isVerified: { type: Boolean, default: false },
  twoFactorEnabled: {
  type: Boolean,
  default: false
},
twoFactorSecret: {
  type: String,
  default: ''
}

});

module.exports = mongoose.model('User', userSchema);
