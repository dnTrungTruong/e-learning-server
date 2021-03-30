const mongoose = require('mongoose');

//define lecture collection schema in MongoDB
const LectureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: true
   },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  resources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource'
  }],
  url: {
    type: String,
    required: true
  }
});

//use schema for 'lecture' collection schema
const Lecture = mongoose.model('Lecture', LectureSchema);


module.exports = Lecture;