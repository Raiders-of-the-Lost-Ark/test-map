// server.js

// BASE SETUP
// =============================================================================
var City = require('./models/cities');
var User = require('./models/users');

var Hasher = require('./modules/generate-pass.js');
var TestPass = require('./modules/test-pass.js');
var UTMconvert = require('./modules/UTMconverter.js');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var cities = mongoose.createConnection('mongodb://138.197.28.83:27017/democities');
var users = mongoose.createConnection('mongodb://138.197.28.83:27017/demousers')

var CityModel = cities.model('City', City);
var UserModel = users.model('Users', User);

// call the packages we need
var express    = require('express');        // call express
var session = require('express-session');

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
var ejsLayouts = require("express-ejs-layouts");
//app.use(ejsLayouts);

// Public folder
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 8080;        // set our port
var router = express.Router();              // get an instance of the express Router

// TESTING THIS AS A GLOBAL
app.locals.loggedin = false;
// TESTING THIS AS A GLOBAL

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

router.get('/admin', restrict, function(req, res) {
    UserModel.find(function(err, users){
        if(err){
            res.send(err);
        }
        if (users){
            res.locals.users = users;
            res.render('pages/admin');
        }
    });
});

router.get('/account', restrict, function(req, res) {
    res.render('pages/account'); // Render account template
});

router.get('/login', function(req, res) {
    res.render('pages/login');   // Render login page template
});

router.get('/testlogin', function(req, res){
    res.render('pages/testlogin');
})


// Lightbox route
// ----------------------------------
router.get('/lightbox', function(req, res) {
    var reqSite = req.query.site;

    CityModel.find({ name: reqSite }, function(err, city) {
        if (err)
            res.send(err);
        if (city) {
            // Render sidebar html from template
            res.render('lightbox', { layout: false, data: city[0] }, function(err, html) {
                // Send html to client
                res.send(html);
            });
        }
    });
});


// LOGOUT FUNCTION
router.get('/logout', function(req, res){
    console.log("LOGGING OUT");
	req.session.destroy();	
    res.redirect('/');
});

// Restrict function that checks if someone is logged in

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}


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

router.post('/editSite', function(req, res) {
    var reqSite = req.body.idkey;
    console.log("Looking for site " + reqSite);
    CityModel.find({ "_id": reqSite }, function(err, city) {
        console.log(city);
        if (err)
            res.send(err);
        if (city && city[0]) {

            CityModel.findOneAndUpdate(
                {
                    _id: reqSite
                },
                { 
                    "name": req.body.name,
                    "misc": req.body.misc
                },
                {new: true},
                function(err, result) {
                    if (err) { 
                        console.log(err); 
                        res.send(err); 
                        return;
                    }
                    if (result) {
                        console.log("Updated: " + result);
                        // Render updated site info
                        res.render('siteinfo', { layout: false, data: result }, function(err, html) {
                            // Send html to client
                            res.send(html);
                        });
                    } else {
                        console.log("No result aaaaaa!");
                    }
                }
            );
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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhh, very secret'
}));

// Session-persisted message middleware

app.use(function(req, res, next){
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
});


// loginPage partial router
router.post('/testpass', function(req, res){
    //console.log("Received User " + req.body.email);
    UserModel.find({email: req.body.email}, function(err, user) {
        if (err){
            res.redirect('back');
        }
        if(user[0]) {
            //console.log(user[0].passwordSalt);
            //console.log(TestPass(req.body.password, user[0].passwordSalt, user[0].passwordHash));
            if(TestPass(req.body.password, user[0].passwordSalt, user[0].passwordHash) == true){
                req.session.regenerate(function(){
                // Store the user's primary key
                // in the session store to be retrieved,
                // or in this case the entire user object
                req.session.user = user[0];
                req.session.success = 'Authenticated as ' + user[0].email;
                app.locals.loggedin = true;
                console.log(app.locals.loggedin);
                res.redirect('/admin');
                });
            }
            else
                res.redirect('back');
        } else
            res.redirect('back');
    })
});
// temporary create site and create account pages

router.get('/create', function(req, res){ // to create an account
    res.render('pages/create');
});

router.get('/input', function(req, res){ // to create a site
    res.render('pages/inputtest');
});

// ROUTES FOR OUR API
// =============================================================================
router.use(function(req, res, next){
    console.log('Something is happening.');
    next();
})
//Check UTM fields for empty data
function isUTM(zone,easting,northing){
	if (zone == "" || easting == ""|| northing =="" ||
		zone == null || easting == null || northing == null)
		return false;
	else
		return true;
}
//Check Lat long fields for empty data
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
		//if the utm field was used run the converter...else enter data like normal
        if (isUTM(req.body.zone, req.body.easting, req.body.northing)){
			var latLngArray = UTMconvert(req.body.zone, req.body.easting, req.body.northing);
			city.lat = latLngArray[0];
			city.lng = latLngArray[1];
		}
        else if (isLatLong(req.body.Latitude, req.body.Longitude)){
			city.lat = req.body.Latitude;    // set the city's lat (from request)
			city.lng = req.body.Longitude;    // set the city's long (from request)s
		};
        city.misc = req.body.custom;
        let image =req.files.customFile;
        if (typeof(image) != "undefined")
        {
        var fileDir=__dirname+("/public/images");
        let uploadPath=path.join(fileDir,image.name);
        image.mv(uploadPath,function(err)
        {
            if (err)
                return res.status(500).send(err);
           // res.send('file uploaded to' +uploadPath);
        });
        
        city.images=image.name;
        }
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


router.route('/register') // post functioon to actually register account

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
        //res.redirect('/');
    });

router.route('/deletesite')
    .post(function(req,res){
        var siteId= req.body.idkey;
        console.log(siteId);
        CityModel.remove({_id:siteId}, function(err){
            if(!err){
                console.log("successfull");
            } else {
                console.log(err);
            }
        });
        res.redirect('back');
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
