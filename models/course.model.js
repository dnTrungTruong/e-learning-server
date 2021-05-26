const mongoose = require('mongoose');
const Subject = require('./subject.model')
const mongoosePaginate = require("mongoose-paginate-v2");

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
  objectives: [{
    type: String
  }],
  img_url: {
    type: String
  },
  price: {
      type: Number,
      required: true  
  },
  status: {
    type: String,
    default: "new"
  },
  sections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section'
  }],
  type: {
    type: String,
    required: true
  },
  avgRate: {
    type: Number
  },
  reviewsNumber: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String
  }]
});
CourseSchema.index({name: 'text'});

CourseSchema.index({status: -1, name: 1, type: 1, subject: 1});

CourseSchema.plugin(mongoosePaginate);

//use schema for 'course' collection schema
const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;