var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CitySchema = new Schema({
    name: String,
    lat: String,
    lng: String,
    misc: String
});

// this is our predefined schema for a city (location and lat/long)
module.exports = CitySchema;