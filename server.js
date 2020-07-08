var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
var PORT = 3000;

// Scraping tools
var axios = require('axios');
var cheerio = require('cheerio');

// Models
var db = require('./models');

// Express
var app = express();

// Use morgan logger for logging requests
app.use(logger('dev'));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static('public'));

// Handlebars
var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/kotakuHeadlines';

mongoose.connect(MONGODB_URI);

// Routes

app.get('/', function (req, res) {
    res.render('index');
});



// Start the server
app.listen(PORT, function () {
    console.log('App running on port: ' + PORT);
});
