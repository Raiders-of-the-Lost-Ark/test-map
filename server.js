// server.js

// BASE SETUP
// =============================================================================
var Site = require('./models/sites');
var User = require('./models/users');

var Hasher = require('./modules/generate-pass.js');
var TestPass = require('./modules/test-pass.js');
var UTMconvert = require('./modules/UTMconverter.js');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var sites = mongoose.createConnection('mongodb://138.197.28.83:27017/testsites');
var users = mongoose.createConnection('mongodb://138.197.28.83:27017/testusers')

var SiteModel = sites.model('Site', Site);
var UserModel = users.model('Users', User);

// call the packages we need
var express    = require('express');        // call express
var session    = require('express-session');

const fileUpload = require('express-fileupload');
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var http = require('http'),
      fs = require('fs');
const path = require('path');

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

app.locals.countySites = null;
app.locals.countyView = false;

// PAGE ROUTES
// =============================================================================

// MAIN ROUTE FOR INDEX/Main Page
router.get('/', function(req, res) {
    app.locals.countyView = false;
    if (req.session.user) {
    app.locals.loggedin = true;
    } else {
        app.locals.loggedin = false;
    }
    var sites = {};
    SiteModel.find(function(err, sites) {
        if (err) {
            res.send(err);
        }
        if (sites) {
            //console.log(sites);
            res.locals.sites = sites;
            res.render('pages/index'); // Render index template
        }
    });
});

// ROUTE FOR ADMIN PAGE, RESTRICTED TO LOGGED IN ADMINS
router.get('/admin', restrict, adminRestrict, function(req, res) {
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

// ROUTE FOR ACCOUNT PAGE, RESTRICTED TO LOGGED IN USERS
router.get('/account', restrict, function(req, res) {
    res.render('pages/account'); // Render account template
});

// ROUTE FOR LOGIN PAGE
router.get('/login', function(req, res) {
    res.render('pages/login');   // Render login page template
});

// ROUTE FOR TESTING LOGIN, NOT USED I BELIEVE
router.get('/testlogin', function(req, res){
    res.render('pages/testlogin');
})


// Lightbox route
// ----------------------------------
router.get('/lightbox', function(req, res) {
    var reqSite = req.query.site;

    SiteModel.find({ name: reqSite }, function(err, Site) {
        if (err)
            res.send(err);
        if (Site) {
            // Render sidebar html from template
            res.render('lightbox', { layout: false, data: Site[0] }, function(err, html) {
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
    app.locals.loggedin = false;
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


// Second restrict function, used to check if a logged in user is an admin or not
function adminRestrict(req, res, next) {
    if(req.session.user.isAdmin){
        next();
    } else {
        req.session.error = 'Access Denied!';
        res.redirect('/');
    }
}


router.get('/backup', function(req, res) {
    var execFile = require('child_process').execFile;
    var script = __dirname + ("/public/backup/createbackup.sh");
    var filename = "cwbattlefields.archive";
    var file = __dirname + ("/public/backup/" + filename);

    execFile(script, [], {}, function(error, stdout, stderr) {
        if (stdout) {
            return res.download(file, filename, function(err){
                if (err) {
                    console.log("Download error: " + err);
                }
            });
        } else if (stderr) {
            console.log(stderr);
            return res.send();
        } else if (error) {
            console.log(error);
            return res.send();   
        }
    });
});

router.post('/restore', function(req, res) {
    var execFile = require('child_process').execFile;
    var refreshScript = __dirname + ("/public/backup/refresh.sh");
    var restoreScript = __dirname + ("/public/backup/restore.sh");
    var filename = "cwbattlefields.archive";

    // Execute script to prepare backup directory for restore
    execFile(refreshScript, [], {}, function(error, stdout, stderr) {
        if (stdout) {
            // Once backup directory is ready, add new backup file
            var file = req.files.backupFile;
            if (typeof(file) != "undefined") {
                var fileDir = __dirname + ("/public/backup");
                var uploadPath=path.join(fileDir, filename);
                // Move uploaded file to backup folder
                file.mv(uploadPath,function(err) {
                    // Handle upload error
                    if (err) {
                        return res.status(500).send(err);
                    // If successful, continue restore
                    } else {
                        // Execute restore script
                        execFile(restoreScript, [], {}, function(error, stdout, stderr) {
                            if (stdout) {
                                // When finished, display success message
                                console.log("IT WORKED AAAAA");
                                return res.send("Restore complete!");
                            } else if (stderr) {
                                console.log(stderr);
                                return res.send();
                            } else if (error) {
                                console.log(stderr);
                                return res.send();
                            }
                        });
                    }
                });
            }
        } else if (stderr) {
            console.log(stderr);
            return res.send();
        } else if (error) {
            console.log(error);
            return res.send();   
        }
    });

});


// Right sidebar routes
// ----------------------------------

router.get('/viewSite', function(req, res) {
    var reqSite = req.query.site;

    SiteModel.find({ name: reqSite }, function(err, Site) {
        if (err)
            res.send(err);
        if (Site) {
            // Render sidebar html from template
            res.render('siteinfo', { layout: false, data: Site[0], newMode: false }, function(err, html) {
                // Send html to client
                res.send(html);
            });
        }
    });
});

router.get('/createSiteMode', function(req, res) {
    // Render sidebar html from template
    res.render('siteinfo', { layout: false, data: {} , newMode: true }, function(err, html) {
        // Send html to client
        res.send(html);
    });
});

router.post('/editSite', function(req, res) {
    var reqSite = req.body.idkey;

    // Get lat and long
    var newLat, newLng;
    if (isUTM(req.body.zone, req.body.easting, req.body.northing)){
        var latLngArray = UTMconvert(req.body.zone, req.body.easting, req.body.northing);
        newLat = latLngArray[0];
        newLng = latLngArray[1];
    }
    else if (isLatLong(req.body.Latitude, req.body.Longitude)){
        newLat = req.body.Latitude;    
        newLng = req.body.Longitude;   
    };
    if(req.body.pubCheck == "on"){
      var newIsPublic = false;
        } else {
      var newIsPublic = true;
        }
    // Get images
    var image = req.files.customFile;
    var newImages = [];
    if (typeof(image) != "undefined") {
        var fileDir = __dirname + ("/public/images");
        var size = image.length;
        //checks if multiple images have been uploaded or only a single image
        if (typeof(size) != "undefined")
            for (var x = 0; x < size; x++) {
                let uploadPath = path.join(fileDir, image[x].name);
                image[x].mv(uploadPath, function(err) {
                    if (err) return res.status(500).send(err);
                    // res.send('file uploaded to' +uploadPath);
                });
                newImages[x] = image[x].name;
            }
        else {
            let uploadPath = path.join(fileDir, image.name);
            image.mv(uploadPath, function(err) {
                if (err) return res.status(500).send(err);
                // res.send('file uploaded to' +uploadPath);
            });
            newImages.push(image.name);
        }
    }

    // PDFs... Oh boy here we go...
    var publicpdf = req.files.pdfFilespublic;
    var privatepdf = req.files.pdfFilesprivate;
    var sitePDF = [];
    var sitePDFView = [];
    var fileDir = __dirname + ("/public/pdf");
    if ((typeof(publicpdf) != "undefined") && (typeof(privatepdf) != "undefined")) {
        var pulength = publicpdf.length;
        var prlength = privatepdf.length;
        if (typeof(pulength) != "undefined")
            if (typeof(prlength) != "undefined") {
                //multi file for both
                //public file first
                console.log("multiple public files, multiple private");
                for (var x = 0; x < pulength; x++) {
                    let uploadPath = path.join(fileDir, publicpdf[x].name);
                    publicpdf[x].mv(uploadPath, function(err) {
                        if (err) return res.status(500).send(err);
                    });
                    sitePDF[x] = publicpdf[x].name;
                    sitePDFView[x] = true;
                }
                for (var x = 0; x < prlength; x++) {
                    uploadPath = path.join(fileDir, privatepdf[x].name);
                    privatepdf[x].mv(uploadPath, function(err) {
                        if (err) return res.status(500).send(err);
                    });
                    sitePDF[x + pulength] = privatepdf[x].name;
                    sitePDFView[x + pulength] = false;
                }
            } else {
                //multi public file, single private
                console.log("multiple public files, single private");
                for (var x = 0; x < pulength; x++) {
                    let uploadPath = path.join(fileDir, publicpdf[x].name);
                    publicpdf[x].mv(uploadPath, function(err) {
                        if (err) return res.status(500).send(err);
                    });
                    sitePDF[x] = publicpdf[x].name;
                    sitePDFView[x] = true;
                }
                uploadPath = path.join(fileDir, privatepdf.name);
                privatepdf.mv(uploadPath, function(err) {
                    if (err) return res.status(500).send(err);
                });
                sitePDF[pulength] = privatepdf.name;
                sitePDFView[pulength] = false;
            }
        else
        if (typeof(prlength) != "undefined") {
            //single public file, multi private
            console.log("single public files, multiple private");
            let uploadPath = path.join(fileDir, publicpdf.name);
            publicpdf.mv(uploadPath, function(err) {
                if (err) return res.status(500).send(err);
            });
            sitePDF.push(publicpdf.name);
            sitePDFView.push(true);
            for (var x = 0; x < prlength; x++) {
                uploadPath = path.join(fileDir, privatepdf[x].name);
                privatepdf[x].mv(uploadPath, function(err) {
                    if (err) return res.status(500).send(err);
                });
                sitePDF[x + 1] = privatepdf[x].name;
                sitePDFView[x + 1] = false;
            }
        } else {
            //single public, single private
            console.log("single public files, single private");
            let uploadPath = path.join(fileDir, publicpdf.name);
            publicpdf.mv(uploadPath, function(err) {
                if (err) return res.status(500).send(err);
            });
            sitePDF.push(publicpdf.name);
            sitePDFView.push(true);
            uploadPath = path.join(fileDir, privatepdf.name);
            privatepdf.mv(uploadPath, function(err) {
                if (err) return res.status(500).send(err);
            });
            sitePDF[1] = privatepdf.name;
            sitePDFView[1] = false;
        }
    } else {
        if (typeof(publicpdf) != "undefined") {
            console.log("we are here");
            var pulength = publicpdf.length;
            if (typeof(pulength) != "undefined") {
                console.log("this should be for an array of public pdf")
                for (var x = 0; x < pulength; x++) {
                    let uploadPath = path.join(fileDir, publicpdf[x].name);
                    publicpdf[x].mv(uploadPath, function(err) {
                        if (err) return res.status(500).send(err);
                    });
                    sitePDF[x] = publicpdf[x].name;
                    sitePDF[x].isviewable = true;
                }
            } else {
                console.log("only public file")
                let uploadPath = path.join(fileDir, publicpdf.name);
                publicpdf.mv(uploadPath, function(err) {
                    if (err) return res.status(500).send(err);
                });
                sitePDF.push(publicpdf.name);
                sitePDFView.push(true);
            }
        }
        if (typeof(privatepdf) != "undefined") {
            console.log("we are in this area here");
            var prlength = privatepdf.length;
            if (typeof(prlength) != "undefined") {
                console.log("this should be for an array of private")
                for (var x = 0; x < prlength; x++) {
                    let uploadPath = path.join(fileDir, privatepdf[x].name);
                    privatepdf[x].mv(uploadPath, function(err) {
                        if (err) return res.status(500).send(err);
                    });
                    sitePDF[x] = privatepdf[x].name;
                    sitePDF[x].isviewable = false;
                }
            } else {
                console.log("only 1 private file")
                let uploadPath = path.join(fileDir, privatepdf.name);
                privatepdf.mv(uploadPath, function(err) {
                    if (err) return res.status(500).send(err);
                });
                sitePDF.push(privatepdf.name);
                sitePDFView.push(false);
            }
        }
    }
    // That was fun.


    // Now let's resume modifying the site
    SiteModel.find({ "_id": reqSite }, function(err, siteResult) {
        var site = siteResult[0];
        if (err)
            res.send(err);
        if (site) {
            // Merge old and new arrays
            newImages = newImages.concat(site.images);
            sitePDF = site.pdf.concat(sitePDF);
            sitePDFView = site.pdfview.concat(sitePDFView);

            // Update site data
            SiteModel.findOneAndUpdate(
                {
                    _id: reqSite
                },
                { 
                    "name": req.body.name,
                    "lat": newLat,
                    "lng": newLng,
                    "misc": req.body.misc,
                    "images": newImages,
                    "pdf": sitePDF,
                    "pdfview": sitePDFView,
                    "isPublic": newIsPublic,
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
                        res.render('siteinfo', { layout: false, data: result, newMode: false }, function(err, html) {
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

    SiteModel.find({ name: reqSite }, function(err, Site) {
        if (err) 
            res.send(err);

        if (Site) {
            // Render bubble html from template
            res.render('bubble', { layout: false, data: Site[0] }, function(err, html) {
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


router.post('/changepass', function(req, res){
    console.log("Received Password " + req.body.currPass);
    console.log("Received New Pass 1 " + req.body.newPass1);
    console.log("Received New Pass 2 " + req.body.newPass2);

    var currentPass = req.body.currPass;
    var newPass1 = req.body.newPass1;
    var newPass2 = req.body.newPass2;

    if(TestPass(currentPass, req.session.user.passwordSalt.toString(), req.session.user.passwordHash.toString()))
    {
        if(newPass1 == newPass2){
            var temp = Hasher(newPass1);
             UserModel.findOneAndUpdate(
                {
                    _id: req.session.user._id
                },
                { 
                    "passwordHash": temp.passwordHash,
                    "passwordSalt": temp.salt
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
                        res.render('account', { layout: false, data: result }, function(err, html) {
                            // Send html to client
                            res.send(html);
                        });
                    } else {
                        console.log("No result aaaaaa!");
                    }
                }
            );
        } else {
            console.log("New Passwords Did Not Match");
            res.redirect('/account');
        }
    } else {
        console.log("This password is incorrect.");
    }

    //console.log(req.session.user.passwordSalt);

    res.redirect('/account');
});

// loginPage partial router
router.post('/testpass', function(req, res){
    console.log("Received User " + req.body.email);
    UserModel.find({email: req.body.email}, function(err, user) {
        if (err){
            res.redirect('back');
        }
        if(user[0]) {
            console.log(user[0].passwordSalt);
            console.log(TestPass(req.body.password, user[0].passwordSalt, user[0].passwordHash));
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

router.post('/countySites', function(req, res){
    var temp = req.body.siteList;
    var objs = JSON.parse(temp);
    for(var i = 0; i < objs.length; i++){
        console.log(objs[i].name);
    }

    app.locals.countySites = objs;
    app.locals.countyView = true;
    res.render('sidebar')
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
// on routes that end in /sites
// ----------------------------------------------------
router.route('/sites')

    // create a Site (accessed at POST http://localhost:8080/api/Site)
    .post(function(req, res) {
        
        var Site = new SiteModel();      // create a new instance of the Site model (schema)
        Site.name = req.body.name;  // set the Site's name (from request)
		//if the utm field was used run the converter...else enter data like normal
        if (isUTM(req.body.zone, req.body.easting, req.body.northing)){
			var latLngArray = UTMconvert(req.body.zone, req.body.easting, req.body.northing);
			Site.lat = latLngArray[0];
			Site.lng = latLngArray[1];
		}
        else if (isLatLong(req.body.Latitude, req.body.Longitude)){
			Site.lat = req.body.Latitude;    // set the Site's lat (from request)
			Site.lng = req.body.Longitude;    // set the Site's long (from request)s
		};
        Site.misc = req.body.misc;

        // store the user
        Site.userFName = req.session.user.firstName;
        Site.userLName = req.session.user.lastName;

        if(req.body.pubCheck == "on"){
            Site.isPublic = false;
        } else {
            Site.isPublic = true;
        }



        let image =req.files.customFile;
        //checks if a image was uploaded
        if (typeof(image) != "undefined")
        {
        var fileDir=__dirname+("/public/images");
        var size = image.length;
        //checks if multiple images have been uploaded or only a single image
        if(typeof(size) != "undefined")
        for(var x=0; x<size;x++)
        {
        let uploadPath=path.join(fileDir,image[x].name);
        image[x].mv(uploadPath,function(err)
        {
            if (err)
                return res.status(500).send(err);
           // res.send('file uploaded to' +uploadPath);
        });
        
        Site.images[x]=image[x].name;
        }
        else
        {
        let uploadPath=path.join(fileDir,image.name);
        image.mv(uploadPath,function(err)
        {
            if (err)
                return res.status(500).send(err);
           // res.send('file uploaded to' +uploadPath);
        });
        
        Site.images=image.name;
        }
        }

        let publicpdf =req.files.pdfFilespublic;
        let privatepdf=req.files.pdfFilesprivate;

        var fileDir=__dirname+("/public/pdf");
        if ((typeof(publicpdf) != "undefined")&&(typeof(privatepdf) != "undefined"))
        {
            var pulength=publicpdf.length;
            var prlength=privatepdf.length;
            if(typeof(pulength) != "undefined")
              if(typeof(prlength) != "undefined")
              {
                //multi file for both
                //public file first
                console.log("multiple public files, multiple private");
                
                for(var x=0; x<pulength;x++)
                {
                    let uploadPath=path.join(fileDir,publicpdf[x].name);
                    publicpdf[x].mv(uploadPath,function(err)
                    {
                      if (err)
                     return res.status(500).send(err);
                      });
                        Site.pdf[x]=publicpdf[x].name; 
                        Site.pdfview[x]=true;
                }
                for(var x=0; x<prlength;x++)
                {
                    uploadPath=path.join(fileDir,privatepdf[x].name);
                    privatepdf[x].mv(uploadPath,function(err)
                    {
                      if (err)
                     return res.status(500).send(err);
                      });
                    Site.pdf[x+pulength]=privatepdf[x].name; 
                    Site.pdfview[x+pulength]=false;
                }
              }
              else
              {
                //multi public file, single private
                console.log("multiple public files, single private");
                for(var x=0; x<pulength;x++)
                {
                    let uploadPath=path.join(fileDir,publicpdf[x].name);
                    publicpdf[x].mv(uploadPath,function(err)
                    {
                      if (err)
                     return res.status(500).send(err);
                      });
                        Site.pdf[x]=publicpdf[x].name; 
                        Site.pdfview[x]=true;
                }
                uploadPath=path.join(fileDir,privatepdf.name);
                privatepdf.mv(uploadPath,function(err)
                {
                  if (err)
                 return res.status(500).send(err);
                  });
                 Site.pdf[pulength]=privatepdf.name; 
                 Site.pdfview[pulength]=false;

              }
            else
              if(typeof(prlength) != "undefined")
              {
                //single public file, multi private
                console.log("single public files, multiple private");
                let uploadPath=path.join(fileDir,publicpdf.name);
                publicpdf.mv(uploadPath,function(err)
                {
                  if (err)
                 return res.status(500).send(err);
                  });
                 Site.pdf=publicpdf.name; 
                 Site.pdfview=true;

                for(var x=0; x<prlength;x++)
                {
                    uploadPath=path.join(fileDir,privatepdf[x].name);
                    privatepdf[x].mv(uploadPath,function(err)
                    {
                      if (err)
                     return res.status(500).send(err);
                      });
                    Site.pdf[x+1]=privatepdf[x].name; 
                    Site.pdfview[x+1]=false;
                }

              }
              else
              {
                //single public, single private
                console.log("single public files, single private");
                let uploadPath=path.join(fileDir,publicpdf.name);
                publicpdf.mv(uploadPath,function(err)
                {
                  if (err)
                 return res.status(500).send(err);
                  });
                 Site.pdf=publicpdf.name; 
                 Site.pdfview=true;

                uploadPath=path.join(fileDir,privatepdf.name);
                privatepdf.mv(uploadPath,function(err)
                {
                  if (err)
                 return res.status(500).send(err);
                  });
                 Site.pdf[1]=privatepdf.name; 
                 Site.pdfview[1]=false;
              }
                

        }
        else
        {
            if(typeof(publicpdf) != "undefined")
            {
            console.log("we are here");
            var pulength=publicpdf.length;
            if(typeof(pulength) != "undefined")
            {
                console.log("this should be for an array of public pdf")
                for(var x=0; x<pulength;x++)
                {
                let uploadPath=path.join(fileDir,publicpdf[x].name);
                publicpdf[x].mv(uploadPath,function(err)
                {
                  if (err)
                 return res.status(500).send(err);
                  });
                 Site.pdf[x]=publicpdf[x].name; 
                 Site.pdf[x].isviewable=true;
             }
            }
            
            else
            {
                console.log("only public file")
                let uploadPath=path.join(fileDir,publicpdf.name);
                publicpdf.mv(uploadPath,function(err)
                {
                  if (err)
                 return res.status(500).send(err);
                  });
                 Site.pdf=publicpdf.name; 
                 Site.pdfview=true;

            }
            }
            if(typeof(privatepdf) != "undefined")
            {
                console.log("we are in this area here");
            var prlength=privatepdf.length;
            if(typeof(prlength) != "undefined")
            {
                console.log("this should be for an array of private")
                for(var x=0; x<prlength;x++)
                {
                let uploadPath=path.join(fileDir,privatepdf[x].name);
                privatepdf[x].mv(uploadPath,function(err){
                  if (err)
                 return res.status(500).send(err);
                  });
                 Site.pdf[x]=privatepdf[x].name; 
                 Site.pdf[x].isviewable=false;
                }
            }
            else
            {
                console.log("only 1 private file")
                let uploadPath=path.join(fileDir,privatepdf.name);
                privatepdf.mv(uploadPath,function(err)
                {
                  if (err)
                 return res.status(500).send(err);
                  });
                 Site.pdf=privatepdf.name; 
                 Site.pdfview=false;

            }

            }
        }
        // save the Site and check for errors
        
        Site.save(function(err) {
            if (err)
                res.send(err);
        });
        //Redirect can be used to send to another webpage after executing the code above it
        
        res.redirect('back');
    });


router.route('/register') // post function to actually register account

    .post(function(req, res){
        var user = new UserModel();
        var temp = Hasher(req.body.password);
        user.email = req.body.email;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.passwordHash = temp.passwordHash;
        user.passwordSalt = temp.salt;

        console.log(req.body.role);
        if(req.body.role == 1){
            user.isAdmin = false;
        } else {
            user.isAdmin = true;
        }

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
        console.log("Deleting site:" + siteId);
        SiteModel.remove({_id:siteId}, function(err){
            if(!err){
                console.log("...Successful!");
            } else {
                console.log(err);
            }
        });
        res.redirect('back');
    });

router.route('/deleteuser')
    .post(function(req,res){
        var userId= req.body.userId;
        console.log("Deleting user: " + userId);
        UserModel.remove({_id:userId}, function(err){
            if(!err){
                console.log("...Successful!");
            } else {
                console.log(err);
            }
        });
        res.redirect('back');
    });

router.route('/deleteimg')
    .post(function(req,res){
        var siteId = req.body.siteId;
        var imgName = req.body.imgName;

        SiteModel.find({ "_id": siteId, "images": imgName }, function(err, result) {
            if (err) {
                console.log("Error deleting image: " + err);
            }
            else {
                var site = result[0];
                var newImgList = [];

                newImgList = site.images;

                var itemInd = newImgList.indexOf(imgName);

                if (itemInd >= 0) { // Bad things happen if this is < 0
                    // Remove the item
                    newImgList.splice(itemInd,1);
                }
                else {
                    console.log("Item isn't in the pdf list... Nothing changed.");
                }

                // Update site data
                SiteModel.findOneAndUpdate(
                    {
                        _id: site._id
                    },
                    { 
                        "images": newImgList,
                    },
                    {new: true},
                    function(err, result) {
                        if (err) { 
                            console.log(err); 
                            res.send(err); 
                            return;
                        }
                        if (result) {
                            // Nice
                            res.send("Nice");
                        } else {
                            console.log("Didn't get a result...");
                        }
                    }
                );
            }
        });
    });

router.route('/deletepdf')
    .post(function(req,res){
        var siteId = req.body.siteId;
        var pdfName = req.body.pdfName;

        SiteModel.find({ "_id": siteId, "pdf": pdfName }, function(err, result) {
            if (err) {
                console.log("Error deleting pdf: " + err);
            }
            else {
                var site = result[0];
                var newPdf = [];
                var newPdfView = [];

                newPdf = site.pdf;
                newPdfView = site.pdfview;

                var itemInd = newPdf.indexOf(pdfName);

                if (itemInd >= 0) { // Bad things happen if this is < 0
                    // Remove the item
                    newPdf.splice(itemInd,1);
                    newPdfView.splice(itemInd,1);
                }
                else {
                    console.log("Item isn't in the pdf list... Nothing changed.");
                }

                // Update site data
                SiteModel.findOneAndUpdate(
                    {
                        _id: site._id
                    },
                    { 
                        "pdf": newPdf,
                        "pdfview": newPdfView,
                    },
                    {new: true},
                    function(err, result) {
                        if (err) { 
                            console.log(err); 
                            res.send(err); 
                            return;
                        }
                        if (result) {
                            // Nice
                            res.send("Nice");
                        } else {
                            console.log("Didn't get a result...");
                        }
                    }
                );
            }
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
