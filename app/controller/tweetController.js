var tweetDB = require('../../db/tweetDB')

module.exports = {
	saveTweet: function(tweet, callback){
		return tweetDB.saveTweet(tweet, callback)
	},
	getTweets: function(callback){
		return tweetDB.getTweets(callback)
	}
}
