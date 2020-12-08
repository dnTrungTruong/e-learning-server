const mongoose = require('mongoose');
const Subject = require('./subject.model')

//define course collection schema in MongoDB
const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject', //refer to collection subjects in DB in order to use populate
      required: true
  },
  instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', //refer to collection users in DB in order to use populate
      required: true
  },
  description: {
      type: String
  },
  img: {
    type:String
  },
  img_url: {
    type: String
  },
  price: {
      type: Number,
      required: true  },
  sections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section'
  }]
});

//use schema for 'course' collection schema
const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;