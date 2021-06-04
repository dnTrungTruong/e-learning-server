const mongoose = require('mongoose');

//define subject collection schema in MongoDB
const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
}//,
  // {collation: { locale: 'en', strength: 2 }}
);
SubjectSchema.index({name: 'text'});
//use schema for 'subject' collection schema
const Subject = mongoose.model('Subject', SubjectSchema);

module.exports = Subject;