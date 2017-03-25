// server.js

// BASE SETUP
// =============================================================================
var City = require('./models/cities');
    
var mongoose = require('mongoose');
mongoose.connect('mongodb://138.197.28.83:27017/testcities');


// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var http = require('http'),
    fs = require('fs');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// view engine setup
app.set('view engine', 'ejs');

// Public folder
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 8080;        // set our port

var router = express.Router();              // get an instance of the express Router

// PAGE ROUTES
// =============================================================================
var index = router.get('/', function(req, res) {
    res.render('pages/index');
});

var admin = router.get('/admin', function(req, res) {
    res.render('pages/admin');
});

var admin = router.get('/account', function(req, res) {
    res.render('pages/account');
});

// ROUTES FOR OUR API
// =============================================================================
router.use(function(req, res, next){
    console.log('Something is happening.');
    next();
})

var admin = router.get('/admin', function(req, res) {
    res.render('views/pages/index', { });
    //res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// on routes that end in /cities
// ----------------------------------------------------
router.route('/cities')

    // create a city (accessed at POST http://localhost:8080/api/city)
    .post(function(req, res) {
        
        var city = new City();      // create a new instance of the City model (schema)
        city.name = req.body.name;  // set the city's name (from request)
        city.lat = req.body.lat;    // set the city's lat (from request)
        city.lng = req.body.lng;    // set teh city's long (from request)

        // save the city and check for errors
        city.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'City created!' });
        });
        
    })

    .get(function(req, res) {
        City.find(function(err, cities) {
            if (err)
                res.send(err);

            res.json(cities);
        });
    });
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// SET PAGE ROUTES
app.use('/', index);
app.use('/admin', index);
app.use('/account', index);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Web Server Open on port ' + port);
