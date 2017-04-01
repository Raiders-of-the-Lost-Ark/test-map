// server.js

// BASE SETUP
// =============================================================================
var City = require('./models/cities');

var mongoose = require('mongoose');
mongoose.connect('mongodb://138.197.28.83:27017/testcities');


// call the packages we need
var express    = require('express');        // call express
const fileUpload = require('express-fileupload');
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var http = require('http'),
    fs = require('fs');
const path= require('path');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

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
        let image =req.files.customFile;

        var fileDir=__dirname+("/public/images");
        let uploadPath=path.join(fileDir,image.name);
        image.mv(uploadPath,function(err)
        {
            if (err)
                return res.status(500).send(err);
            res.send('file uploaded to' +uploadPath);
        });
        // save the city and check for errors
       // city.save(function(err) {
        //    if (err)
       //         res.send(err);
      //  });
        //Redirect can be used to send to another webpage after executing the code above it
    //    res.redirect('back');
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
