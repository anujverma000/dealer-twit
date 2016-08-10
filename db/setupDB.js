var Setup = require('../app/models/setup');
var mongoose = require('mongoose');

module.exports = {
	isUserSetupDone: function(user, callback){
		Setup.find({ 'twitter.username' : user.twitter.username }, function(err, setupData) {
			if(err) throw err
			callback(setupData);
		})
	},
	saveSetup: function(setupData, callback){
		var newSetup = new Setup();
		newSetup.twitter.username = setupData.username
		newSetup.search = setupData.value;
		newSetup.save(function(err,res) {
            if (err)
                throw err;
							return callback({id: res._id, value: res.search})
        })
	},
	deleteSetup: function(setupData,callback){
		Setup.remove({_id : setupData.id}, function (err,res){
					return callback({id: res._id});
       })
	  }
}
