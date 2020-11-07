const mongoose = require('mongoose');

//define section collection schema in MongoDB
const SectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
  }
});

//use schema for 'section' collection schema
const Section = mongoose.model('Section', SectionSchema);


module.exports = Section;