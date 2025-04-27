const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address']
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Enter a valid 10-digit phone number']
  },
  password: { type: String, required: true },
  friends: [
    {
      name: String,
      phone: String
    }
  ]
  
});

module.exports = mongoose.model('User', userSchema);
