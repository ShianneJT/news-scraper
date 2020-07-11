const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const exphbs = require('express-handlebars');

const db = require('./models');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.engine('handlebars', exphbs({ defaultLayout: 'main', handlebars: allowInsecurePrototypeAccess(Handlebars) }));
app.set('view engine', 'handlebars');


const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/kotakuHeadlines_testing';
mongoose.connect(MONGODB_URI);


// Routes
app.get('/', function(req, res) {
    db.Article.find({})
        .then(function(response) {
            let dbResponse = {
                articles: response
            };
            res.render('index', dbResponse);
        }).catch(function(err) {
            console.log(err);
            res.send(err);
        });
});

// Scrape articles
app.get('/scrape', function(req, res) {
    axios.get('http://kotaku.com').then(function (response) {
        let $ = cheerio.load(response.data);

        $('article').each(function (i, element) {
            let result = {};

            result.title = $(element)
                .find('h2')
                .text();
            result.summary = $(element)
                .find('p')
                .text();
            result.link = $(element)
                .find('figure')
                .children('a')
                .attr('href');
            result.image = $(element)
                .find('figure')
                .find('img, video')
                .attr('data-chomp-id');

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log('DB Article: ' + dbArticle);  // test 
                })
                .catch(function (err) {
                    console.log(err);
                });
        });
        res.redirect('back');
    });
});

// Get saved articles
app.get('/saved', function(req, res) {
    db.Article.find({ saved: true })
        .populate('notes')
        .then(function(response) {
            let dbResponse = {
                articles: response
            };
            res.render('saved', dbResponse);
        }).catch(function(err) {
            console.log(err);
            res.send(err);
        });
});

// Saving an article
app.post('/saved/:id', function(req, res) {
    db.Article
        .findOneAndUpdate({ _id: req.params.id }, { $set: { saved: true } })
        .then(function(result) {
            res.json(result);
        })
        .catch(function(err) {
            res.json(err);
        });
});

// Removing an article from saved
app.post('/deleted/:id', function(req, res) {
    db.Article
        .findOneAndUpdate({ _id: req.params.id }, { $set: { saved: false } })
        .then(function(result) {
            res.json(result);
        })
        .catch(function(err) {
            res.json(err);
        });
});








// Adding a comment
app.post('/articles/:id', function(req, res) {
    db.Note
        .create(req.body)
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { notes: dbNote._id }, { new: true });
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});





// Get all articles
app.get('/articles', function(req, res) {
    db.Article.find({})
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});


app.get('/articles/:id', function(req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate('note')
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});






// Adding a comment

// Deleting a comment



/*

// Routes
app.get('/', function(req, res) {
    db.Article.find({})
        .then(function(response) {
            let dbResponse = {
                articles: response
            };
            res.render('index', dbResponse);
        }).catch(function(err) {
            console.log(err);
            res.send(err);
        });
});


// All articles
app.get('/articles', function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
        .catch(function (err) {
            console.log(err);
            res.json(err);
        });
});

// Route for grabbing an article and associated comments
app.get('/articles/:id', function(req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate('comments')
        .then(function(dbArticle) {
            console.log(dbArticle);
            res.json(dbArticle);
        }).catch(function(err) {
            console.log(err);
            res.send(err);
        });
});

// Route for adding a comment
app.post('/articles/:id', function(req, res) {
    db.Comment.create(req.body)
        .then(function(dbComment) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { comment: dbComment }}, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle)
        }).catch(function(err) {
            console.log(err);
            res.json(err);
        });
});
*/

// Start the server
app.listen(PORT, function () {
    console.log('App running on port: ' + PORT);
});
