/*  users.js
    This is our schema file for mongoose.
    Making this allows us to fill in data in a 
    predefined format.*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

    // Create the user schema
var UserSchema = new Schema({
    email: String,
    firstName: String,
    lastName: String,
    passwordHash: String,
    passwordSalt: String,
    isAdmin: Boolean
});

    // Export the user schema
module.exports = UserSchema;