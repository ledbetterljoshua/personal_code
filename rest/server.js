var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/saved')

var app = express();
app.use(bodyParser.urlencoded({extend: true}));
app.use(bodyParser.json());
app.use(bodyParser());

app.use('/api', require('./routes/api'))

app.listen(3000)
console.log('API is running on port 3000')