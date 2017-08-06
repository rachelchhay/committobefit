const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// create schema
const UserSchema = new mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true}
});

// plugin for passport local
UserSchema.plugin(passportLocalMongoose);

// export model, model has to be made AFTER plugin
module.exports = mongoose.model('User', UserSchema);
