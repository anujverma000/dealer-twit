var mongoose = require('mongoose');

var tweetSchema = mongoose.Schema({
    tweet: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Tweet', tweetSchema);