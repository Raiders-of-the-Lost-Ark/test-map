var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: String,
    firstName: String,
    lastName: String,
    passwordHash: String,
    passwordSalt: String,
    isAdmin: Boolean
});

module.exports = UserSchema;