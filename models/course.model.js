const mongoose = require('mongoose');
const Subject = require('./subject.model')

//define course collection schema in MongoDB
const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sub_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject', //refer to collection subjects in DB in order to use populate
      required: true
  },
  instructor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', //refer to collection users in DB in order to use populate
      required: true
  },
  description: {
      type: String
  },
  price: {
      type: Number,
      required: true
  }
});

//use schema for 'course' collection schema
const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;