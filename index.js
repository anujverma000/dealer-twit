var express  	 = require('express'); 
var cookieParser = require('cookie-parser')
var bodyParser 	 = require('body-parser')
var session 	 = require('express-session')
var app      	 = express();
var port     	 = process.env.PORT || 9090;
var mongoose 	 = require('mongoose');
var passport 	 = require('passport');
var flash    	 = require('connect-flash');

var configDB = require('./config/database.js');

mongoose.connect(configDB.url);

require('./config/passport')(passport);
app.use('/static', express.static(__dirname + '/assets'));
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'ejs');
app.use(session({ secret: '2567cf60-b6c9-4703-9eab-1f9a3607ca72' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport);

app.listen(port);
console.log('server is on : http://localhost:' + port);
