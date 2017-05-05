/*  sites.js
    This is our schema file for mongoose.  It is
    Specifically the schema for sites, It allows us to have
    a dedicated format to our sites. */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

    // set up the schema for a site
var SiteSchema = new Schema({
    name: String,
    lat: String,
    lng: String,
    misc: String,
    images: [String],
	pdf: [String],
	pdfview: [Boolean],
    userFName: String,
    userLName: String,
    isPublic: Boolean
});

// this is our predefined schema for a city (location and lat/long)
module.exports = SiteSchema;