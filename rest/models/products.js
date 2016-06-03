var restful = require('node-restful');
var mongoose = restful.mongoose;

var post = new mongoose.Schema({
	url: String, 
	highlighted: String, 
	comment: String
});

module.exports = restful.model('Products', post)