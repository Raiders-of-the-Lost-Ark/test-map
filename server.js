// server.js

// BASE SETUP
// =============================================================================
var City = require('./models/cities');
var User = require('./models/users');

var Hasher = require('./modules/generate-pass.js');
var CreateUser = require('./modules/add-users.js');


var mongoose = require('mongoose');
var cities = mongoose.createConnection('mongodb://138.197.28.83:27017/testcities');
var users = mongoose.createConnection('mongodb://138.197.28.83:27017/testusers')

var CityModel = cities.model('City', City);
var UserModel = users.model('Users', User);
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

// Partial routes
// ----------------------------------
router.post('/viewSite', function(req, res) {
    console.log("Received site request: " + req.body.site);
    
    //var newURL = currentURL + "?site="
    res.redirect("/viewSite?siteId=" + req.body.site); // Render index template
});

router.get('/viewSite', function(req, res) {

    var reqSite = req.query.siteId;

    CityModel.find({ name: reqSite }, function(err, city) {
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


router.get('/create', function(req, res){
    res.render('pages/create');
});

router.get('/input', function(req, res){
    res.render('pages/inputtest');
});
// ROUTES FOR OUR API
// =============================================================================
router.use(function(req, res, next){
    console.log('Something is happening.');
    next();
})

// on routes that end in /cities
// -----------------------------------------------3-----
router.route('/cities')

    // create a city (accessed at POST http://localhost:8080/api/city)
    .post(function(req, res) {
        
        var city = new CityModel();      // create a new instance of the City model (schema)
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
        CityModel.find(function(err, cities) {
            if (err)
                res.send(err);

            res.json(cities);
        });
    });


router.route('/register')

    .post(function(req, res){
        var user = new UserModel();
        var temp = Hasher(req.body.password);
        user.email = req.body.email;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.passwordHash = temp.passwordHash;
        user.passwordSalt = temp.salt;
        user.save(function(err){
            if(err)
                res.send(err);
        });
        res.redirect('back');

    })
    .get(function(req, res) {
        UserModel.find(function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
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
