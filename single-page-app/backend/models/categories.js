var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var relationship = require("mongoose-relationship");


var Recipe     = require('./recipe');
var User     = require('./user');

var CategorySchema = Schema({
	name	: String, 
	recipes	: [{type: Schema.Types.ObjectId, ref: "Recipe"}], 
	user 	: {type:String, ref:"User" },
	created : {type:Date, default: Date.now}
});

module.exports = mongoose.model('Category', CategorySchema);