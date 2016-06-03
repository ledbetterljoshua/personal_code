var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
//var relationship = require("mongoose-relationship");


var Category     = require('./categories');
var User      = require('./user');

var CommentSchema = Schema({
    text: String,
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

var recipeSchema   = new Schema({
    items: { type : Array , "default" : [] },
    steps: { type : Array , "default" : [] },
    comment: String, 
    image: String, 
    group: String, 
    timeStamp: String, 
    description: String, 
    title: String,
    group: [{ type:String, ref:"Group" }], 
    user: { type:String, ref:"User" },
    comments: [CommentSchema], 
    created: {type:Date, default: Date.now}, 
    private: Boolean, 
    favorite: Boolean, 
    readlater: Boolean

});



module.exports = mongoose.model('Recipe', recipeSchema);