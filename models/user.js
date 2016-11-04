// define schema
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: String,
    email: {type: String, required: true},
    phonenumber: {type: String, required: true},
    isAdmin: { type: Boolean, default: false },
    isAccesor: { type: Boolean, default: false }
    });
	

// set plugin
userSchema.plugin(passportLocalMongoose);

// compile model
var User = mongoose.model('User', userSchema);
//express settings
module.exports = User;