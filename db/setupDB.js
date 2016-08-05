var Setup = require('../app/models/setup');

module.exports = {
	isUserSetupDone: function(user, callback){
		Setup.find({ 'twitter.username' : user.twitter.username }, function(err, setupData) {
			if(err) throw err
			callback(setupData);
		})
	},
	saveSetup: function(setupData, callback){
		var newSetup = new Setup();
		newSetup.twitter.username    = setupData.username
		newSetup.search = setupData.value;
		newSetup.save(function(err) {
            if (err)
                throw err;
            return callback({value: setupData.value})
        })
	}
}