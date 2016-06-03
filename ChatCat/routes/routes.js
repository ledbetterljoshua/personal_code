module.exports = function(express, app, passport) {
	var router = express.Router();
	router.get('/', function(req, res, next) {
		// res.send('<h1>Hello Joshua!</h1>');
		res.render('index', {title:'Welcome To My Castle'});
	})

	router.get('/auth/facebook', passport.authenticate('facebook'));
	router.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect:'/chatrooms', 
		failureRedirect:'/'
	}))

	router.get('/chatrooms', function(req, res, next) {
		res.render('chatrooms', {title:'Chatrooms', user:req.user})
	})

	router.get('/setcolor', function(req, res, next) {
		req.session.favColor = "Green";
		res.send('Setting favourite color!');
	})

	router.get('/getcolor', function(req, res, next) {
		res.send('Favourite Color: ' + (req.session.favColor===undefined?"Not Found":req.session.favColor));
	})

	app.use('/', router);

}
