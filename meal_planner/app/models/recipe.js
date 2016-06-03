var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
//var relationship = require("mongoose-relationship");

var User      = require('./user');

var RecipeSchema   = new Schema({
    image: String, 
    description: String, 
    title: String,
    user: { type:String, ref:"User" },
    created: {type:Date, default: Date.now}, 
    vegetarian: Boolean, 
    meat: String
});



module.exports = mongoose.model('Recipe', RecipeSchema);