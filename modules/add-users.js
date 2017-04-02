var mongoose = require('mongoose');
mongoose.connect('mongodb://138.197.28.83:27017/test-users');
var User = require('../models/users');

module.exports = function(user)
{
    console.log('Hello World');
}