const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const exphbs = require('express-handlebars');

const db = require('./models');

const PORT = 3000;

const app = express();
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.engine('handlebars', exphbs({ defaultLayout: 'main', handlebars: allowInsecurePrototypeAccess(Handlebars) }));
app.set('view engine', 'handlebars');


const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/kotakuHeadlines';
mongoose.connect(MONGODB_URI);


// Routes
app.get('/', function (req, res) {
    res.render('index');
});

// Scrape articles
app.get('/scrape', function(req, res) {
    axios.get('http://kotaku.com').then(function (response) {
        let $ = cheerio.load(response.data);

        $('article').each(function (i, element) {
            
            let result = {};

            result.headline = $(this)
                .find('h2')
                .text();
            result.summary = $(this)
                .find('p')
                .text();
            result.link = $(this)
                .find('a')
                .attr('href');

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log('DB Article: ' + dbArticle);  // test 
                })
                .catch(function (err) {
                    console.log(err);
                });
        });
        res.send('Scrape Complete');
    });
});

app.get('/articles', function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get('/articles/:id', function(req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate('comment')
        .then(function(data) {
            res.json(data);
        }).catch(function(err) {
            console.log(err);
            res.send(err);
        });
});

// Route for adding a comment
app.post('/articles/:id', function(req, res) {
    db.Comment.create(req.body)
        .then(function(dbComment) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { notes: dbComment._id }, { new: true });
        }).catch(function(err) {
            console.log(err);
            res.json(err);
        });
});

// Start the server
app.listen(PORT, function () {
    console.log('App running on port: ' + PORT);
});
