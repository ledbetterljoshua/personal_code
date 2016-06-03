var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
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
app.use(session({ secret: 'ilovesmealsandstuff' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



mongoose.connect('mongodb://meals:Jled5917@ds027415.mongolab.com:27415/meals'); // connect to our database
var Recipe  = require('./app/models/recipe');
var User  = require('./app/models/user');

app.use(express.static(__dirname + "/views"));

var router = express.Router();              // get an instance of the express Router


router.route('/recipes')

    // create a recipe (accessed at recipe http://localhost:8080/api/recipes)
    .post(function(req, res) {
        var recipe            = new Recipe();      // create a new instance of the recipe model
        recipe.image          = req.body.image;
        recipe.title          = req.body.title;
        recipe.description    = req.body.description;
        recipe.timeStamp      = req.body.timeStamp;
        recipe.vegetarian     = req.body.vegetarian;
        recipe.meat        	  = req.body.meat;
        recipe.user           = req.user._id;
        // save the recipe and check for errors

        recipe.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'recipe created!' });
        });
        
    })
    /* ================================== 
		GET FROM THE database
==================================*/
    .get(function(req, res) {
        
        var current_user = req.user;
        console.log("req: " + req)

        Recipe.find({ user: current_user._id }).exec(function(err, recipes) {
          if (err) throw err;

          // show the admins in the past month
          console.log(recipes);
           res.json(recipes);
           console.log("current user:" + current_user);
        });

    });
    /* ==================================
		GET A SINGLE ITEM
==================================*/

	router.route('/recipes/:recipe_id')

    // get the recipe with that id (accessed at GET http://localhost:8080/api/recipes/:recipe_id)
    .get(function(req, res) {
        Recipe.findById(req.params.recipe_id, function(err, recipe) {
            if (err)
                res.send(err);
            res.json(recipe);
        });
    })
    

    // update the recipe with this id (accessed at PUT http://localhost:8080/api/recipes/:recipe_id)
    .put(function(req, res) {

        // use our recipe model to find the recipe we want
        Recipe.findById(req.params.recipe_id, function(err, recipe) {

            if (err)
                res.send(err);

            
            recipe.image = req.body.image;
            recipe.title = req.body.title;
	        recipe.description = req.body.description;
	        recipe.timeStamp = req.body.timeStamp;
            recipe.favorite       = req.body.favorite;
            recipe.vegetarian      = req.body.vegetarian;
            recipe.meat        = req.body.meat;
            recipe.user           = req.user._id;
            // save the recipe
            recipe.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'recipe updated!' });
            });

        });
    })

    // delete the recipe with this id (accessed at DELETE http://localhost:8080/api/recipes/:recipe_id)
    .delete(function(req, res) {
        Recipe.remove({
            _id: req.params.recipe_id
        }, function(err, recipe) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.listen(port)
console.log('hello world from server.js on port 3000')









