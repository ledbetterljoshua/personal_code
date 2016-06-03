var express = require('express'), 
	app = express(),
	path = require('path'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'), 
	config = require('./config/config.js'), 
	ConnectMongo = require('connect-mongo')(session), 
	mongoose = require('mongoose').connect(config.dbURL), 
	passport = require('passport'), 
	FacebookStrategy = require('passport-facebook').Strategy;

//tell express where to find the views
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieParser());
var env = process.env.NODE_ENV || 'production';
if (env === 'development') {
	//dev specific settings
	app.use(session({secret:config.sessionSecret, saveUninitialized:true, resave:true}));
} else {
	//prod specific settings
	app.use(session({
		secret:config.sessionSecret, 
		store: new ConnectMongo({
			//url:config.dbURL, 
			mongooseConnection:mongoose.connections[0],
			stringify:true
		})
	}));
}

app.use(passport.initialize());
app.use(passport.session());

require('./auth/passportAuth.js')(passport, FacebookStrategy, config, mongoose);

//require routes
require('./routes/routes.js')(express, app, passport);

//mongodb://jled5917:chatcat@ds029824.mongolab.com:29824/chatcat
 
app.listen(3000, function(){
	console.log('ChatCAT Working on port 3000')
	console.log('Mode: ' + env)
});