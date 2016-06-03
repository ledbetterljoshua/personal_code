'use strict';

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test', function(err){
	if (err) console.log(err);

	console.log('connected to database');
});