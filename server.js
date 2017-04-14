// server.js

// BASE SETUP
// =============================================================================
var City = require('./models/cities');
var User = require('./models/users');

var Hasher = require('./modules/generate-pass.js');
//var CreateUser = require('./modules/add-users.js');
var TestPass = require('./modules/test-pass.js');
var UTMconvert = require('./modules/UTMconverter.js');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var cities = mongoose.createConnection('mongodb://138.197.28.83:27017/testcities');
var users = mongoose.createConnection('mongodb://138.197.28.83:27017/testusers')

var CityModel = cities.model('City', City);
var UserModel = users.model('Users', User);

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
app.use(express.static('public/images'));

// view engine setup
app.set('view engine', 'ejs');

// Public folder
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 8080;        // set our port
var router = express.Router();              // get an instance of the express Router

// PAGE ROUTES
// =============================================================================
router.get('/', function(req, res) {
    var sites = {};
    CityModel.find(function(err, cities) {
        if (err) {
            res.send(err);
        }
        if (cities) {
            res.locals.sites = cities;
            res.render('pages/index'); // Render index template
        }
    });
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

router.get('/testlogin', function(req, res){
    res.render('pages/testlogin');
})

// Right sidebar routes
// ----------------------------------
router.get('/viewSite', function(req, res) {
    var reqSite = req.query.site;

    CityModel.find({ name: reqSite }, function(err, city) {
        if (err)
            res.send(err);
        if (city) {
            // Render sidebar html from template
            res.render('siteinfo', { layout: false, data: city[0] }, function(err, html) {
                // Send html to client
                res.send(html);
            });
        }
    });
});

// Info bubble routes
// ----------------------------------
router.get('/bubble', function(req, res) {
    var reqSite = req.query.site;

    CityModel.find({ name: reqSite }, function(err, city) {
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


// loginPage partial router
router.post('/testpass', function(req, res){
    console.log("Received User " + req.body.email);
    UserModel.find({email: req.body.email}, function(err, user) {
        if (err)
            res.send(err);

        if(user) {
            console.log(user[0].passwordSalt);
            console.log(TestPass(req.body.password, user[0].passwordSalt, user[0].passwordHash));
        }
    })
    res.redirect('back');
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
function isUTM(zone,easting,northing){
	if (zone == "" || easting == ""|| northing =="" ||
		zone == null || easting == null || northing == null)
		return false;
	else
		return true;
}
function isLatLong(lati,longi){
	if (lati == "" || longi =="" ||
		lati == null || longi == null)
		return false;
	else
		return true;
}
// on routes that end in /cities
// -----------------------------------------------3-----
router.route('/cities')

    // create a city (accessed at POST http://localhost:8080/api/city)
    .post(function(req, res) {
        
        var city = new CityModel();      // create a new instance of the City model (schema)
        city.name = req.body.cityName;  // set the city's name (from request)
        if (isUTM(req.body.zone, req.body.easting, req.body.northing)){
			var latLngArray = UTMconvert.convert(req.body.zone, req.body.easting, req.body.northing);
			city.lat = latLngArray[0];
			city.lng = latLngArray[1];
		}else if (isLatLong(req.body.Latitude, req.body.Longitude)){
			city.lat = req.body.Latitude;    // set the city's lat (from request)
			city.lng = req.body.Longitude;    // set the city's long (from request)
		};
        city.misc = req.body.custom;
        let image =req.files.customFile;

        var fileDir=__dirname+("/public/images");
        let uploadPath=path.join(fileDir,image.name);
        image.mv(uploadPath,function(err)
        {
            if (err)
                return res.status(500).send(err);
           // res.send('file uploaded to' +uploadPath);
        });
        city.images=image.name;
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
