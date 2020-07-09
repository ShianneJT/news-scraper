var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    headline: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    saved: {
        type: Boolean,
        required: true,
        default: false
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }
});

var Article = mongoose.model('Article', ArticleSchema)

module.exports = Article;
