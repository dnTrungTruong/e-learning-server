const mongoose = require('mongoose');

//define lesson collection schema in MongoDB
const LessonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
      type: String,
      require: true
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
  path: {
    type: String,
    required: true
  }
});

//use schema for 'lesson' collection schema
const Lesson = mongoose.model('Lesson', LessonSchema);


module.exports = Lesson;