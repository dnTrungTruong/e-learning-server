const mongoose = require('mongoose');

//define resource collection schema in MongoDB
const ResourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lecture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lecture',
      required: true
   },
   url: {
       type: String,
       required: true
   }
});

//use schema for 'resource' collection schema
const Resource = mongoose.model('Resource', ResourceSchema);


module.exports = Resource;