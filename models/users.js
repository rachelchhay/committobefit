const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// create schema
const userSchema = new mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true}
});

// create model
const User = mongoose.model('User', userSchema);

// plugin for passport local
userSchema.plugin(passportLocalMongoose);

// export model
module.exports = User;
