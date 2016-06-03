var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname + '/public'));


app.use('development', function() {
	app.errorHandler({
		showStack: true, 
		dumpExceptions: true
	});
});


http.createServer(app).listen(app.get('port'), function() {
	console.log('express server listening on port ' + app.get('port'));
});
