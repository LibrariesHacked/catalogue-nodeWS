///////////////////////////////////////////
// Requires
// Use express and custom libraries.js
///////////////////////////////////////////
var express = require('express');
var libraries = require('./libraries');

var app = express();
///////////////////////////////////////////
// Static files
// Setup for serving static content
///////////////////////////////////////////
app.use(express.static('public'));

///////////////////////////////////////////
// Template engine
// Using pug as a basic templating engine
///////////////////////////////////////////
app.set('views', './views');
app.set('view engine', 'pug');

///////////////////////////////////////////
// Routes - Pages
// Routes to deliver pages.
///////////////////////////////////////////
app.get('/', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!' });
});

///////////////////////////////////////////
// Routes - Web service
// The web service routes
///////////////////////////////////////////
app.get('/services', libraries.getServices);
app.get('/servicegeo', libraries.getServiceGeo);
app.get('/libraries', libraries.getLibraries);
app.get('/availabilityByISBN/:isbn', libraries.isbnSearch);
app.get('/thingISBN/:isbn', libraries.thingISBN);

///////////////////////////////////////////
// Routes - Maintenance
// Routes for maintaining the data
///////////////////////////////////////////
// app.get('/refreshbranches', libraries.refreshBranches)
// app.get('/refreshservicetwitters', libraries.refreshServiceTwitters);
// app.get('/refreshbranchtwitters', libraries.refreshBranchTwitters);

///////////////////////////////////////////
// Routes - Testing
// Tests
///////////////////////////////////////////
app.get('/testAvailabilityByISBN', libraries.testIsbnSearch);

///////////////////////////////////////////
// Startup
// Starts up the web service on port 3000
///////////////////////////////////////////
var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
    console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
});