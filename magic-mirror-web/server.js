var express = require('express');
var app 	= express();
var ejs 	= require('ejs');

var port = process.env.PORT || 3000;
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/views'));

app.get('/home', function(req, res) {
    res.render('index.ejs');    
});

app.listen(8000)
console.log('hello world from server.js on port 3000')