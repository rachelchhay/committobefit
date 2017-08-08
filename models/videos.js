const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('./users.js');
//
// // create schema
const VideoSchema = new mongoose.Schema({
  title: {type: String, required: true},
  link: {type: String, required: true},
  category: {type: String, required: true},
  bodyPart: String,
  length: {type: Number, required: true},
  equipment: {type: Boolean, required: true},
  comments: []
});
//
// plugin for passport local
VideoSchema.plugin(passportLocalMongoose);

// export model, model has to be made AFTER plugin
module.exports = mongoose.model('Video', VideoSchema);
