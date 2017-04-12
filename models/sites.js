var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SiteSchema = new Schema({
    name: String,
    lat: String,
    lng: String,
    misc: String,
    images: [String]
});

// this is our predefined schema for a city (location and lat/long)
module.exports = SiteSchema;