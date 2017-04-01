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
router.get('/', function(req, res) {
    res.render('pages/index'); // Render index template
});

router.get('/admin', function(req, res) {
    res.render('pages/admin'); // Render admin template
});

router.get('/account', function(req, res) {
    res.render('pages/account'); // Render account template
});

router.get('/login', function(req, res) {
    res.render('pages/login');   // Render login page template
});

// Right sidebar routes
// ----------------------------------
router.post('/viewSite', function(req, res) {
    console.log("Received site request: " + req.body.site);
    
    //var newURL = currentURL + "?site="
    res.redirect("/viewSite?siteId=" + req.body.site); // Render index template
});

router.get('/viewSite', function(req, res) {

    var reqSite = req.query.siteId;

    City.find({ name: reqSite }, function(err, city) {
        if (err) {
            res.send(err);
            console.log("ERROR HAPPENED");
        }
        if (city) {
            console.log("Rendering page: " + city[0].name);
            res.render('siteinfo', { layout: false, data: city[0] }, function(err, html) {
                res.send(html);
            });
        }
    });

});

// Info bubble routes
// ----------------------------------
router.post('/bubble', function(req, res) {
    // Go get this site
    res.redirect("/bubble?siteId=" + req.body.site); 
});

router.get('/bubble', function(req, res) {
    var reqSite = req.query.siteId;

    City.find({ name: reqSite }, function(err, city) {
        if (err) 
            res.send(err);

        if (city) {
            // Render bubble html from template
            res.render('bubble', { layout: false, data: city[0] }, function(err, html) {
                // Send html to client
                res.send(html);
            });
        }
    });
});


// ROUTES FOR OUR API
// =============================================================================
router.use(function(req, res, next){
    console.log('Something is happening.');
    next();
})

// on routes that end in /cities
// ----------------------------------------------------
router.route('/cities')

    // create a city (accessed at POST http://localhost:8080/api/city)
    .post(function(req, res) {
        
        var city = new City();      // create a new instance of the City model (schema)
        city.name = req.body.cityName;  // set the city's name (from request)
        city.lat = req.body.Latitude;    // set the city's lat (from request)
        city.lng = req.body.Longitude;    // set the city's long (from request)
        city.misc = req.body.custom;
        // save the city and check for errors
        city.save(function(err) {
            if (err)
                res.send(err);
        });
        //Redirect can be used to send to another webpage after executing the code above it
        res.redirect('back');
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

// Set page routes
app.use('/', router); 

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Web Server Open on port ' + port);
