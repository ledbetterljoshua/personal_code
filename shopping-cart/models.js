var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function(wagner) {
	mongoose.connect('mongodb://localhost:27017/test');

	var Category = 
		mongoose.model('Category', require('./src/models/category.js'), 'categories');
	var Product = 
		mongoose.model('Product', require('./src/models/product.js'), 'products');
	var User =
    	mongoose.model('User', require('./src/models/user.js'), 'users');

	var models =  {
		Category: Category,
		Product: Product,
		User: User
	};

	_.each(models, function(value, key) {
		wagner.factory(key, function() {
			return value;
		});
	});

	  return models;
};