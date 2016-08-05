var mongoose = require('mongoose');

var setupSchema = mongoose.Schema({
    twitter          : {
        username     : String
    },
    search: String
});

module.exports = mongoose.model('Setup', setupSchema);