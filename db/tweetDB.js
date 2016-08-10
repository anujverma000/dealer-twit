var Tweet = require('../app/models/tweet');

module.exports = {
	saveTweet: function(tweet, callback){
		var newTweet = new Tweet();
		newTweet.tweet = tweet;
		newTweet.save(function(err) {
            if (err)
                throw err;
            return callback()
        })
	},
	getTweets: function(callback){
		Tweet.find({}, function(err, tweets) {
			if(err) throw err
			callback(tweets);
		})
	}
}