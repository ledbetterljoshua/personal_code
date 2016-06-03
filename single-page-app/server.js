var express = require('express');
var app = express();
var cors = require('cors');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

require('./config/passport.js')(passport)

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://jled5917:Jled591711811000@ds053944.mongolab.com:53944/posts'); // connect to our database
var Recipe  = require('./backend/models/recipe');
var Category = require('./backend/models/categories');
var User  = require('./backend/models/user');

app.use(express.static(__dirname + "/public"));
var router = express.Router(); 

require('./backend/api/recipes.js')(Recipe, router);



app.use('/api', router);
app.listen(3000);
console.log('server running on port 3000')