var setupDB = require('../../db/setupDB')

module.exports = {
	isSetupDone: function(user, callback){
		setupDB.isUserSetupDone(user, callback)
	},
	saveSetup: function(setupData, callback){
		return setupDB.saveSetup(setupData, callback)
	},
	deleteSetup: function(setupDataId, callback){
		return setupDB.deleteSetup(setupDataId, callback)
	}
}
