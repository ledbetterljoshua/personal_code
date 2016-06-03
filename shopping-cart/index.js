'use strict';

var express = require('express');
var wagner = require('wagner-core');
var ejs = require('ejs');

require('./models.js')(wagner);

var app = express();

app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');

app.use('/static', express.static(__dirname + '/public'));

app.get('/', function (req, res)
{
    res.render('index.ejs');
});

wagner.invoke(require('./src/auth.js'), { app: app});

app.use('/api/v1', require('./src/api/api.js')(wagner));
//console.log(require('./api.js')(wagner))
app.listen(3000,function() {
	console.log('listening on port 3000');
});