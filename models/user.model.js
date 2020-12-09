const mongoose = require('mongoose');

//define user collection schema in MongoDB
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    dropDups: true
  },
  password: {
    type: String,
    required: true,
  },
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  birthday: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    required: true
  },
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  createdCourses: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  isVerified: {
    type: Boolean,
    default: false
  }
});

//use schema for 'User' collection schema
const User = mongoose.model('User', UserSchema);

module.exports = User;