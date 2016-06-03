// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
//var relationship = require("mongoose-relationship");


var Category     = require('./categories');
var Recipe     = require('./recipe');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
        username     : String,  
        created: {type:Date, default: Date.now} 

    }, 
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    categories          : [{type: Schema.Types.ObjectId, ref: "Category"}], 
    recipes             : [{type: Schema.Types.ObjectId, ref: "Post"}]

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);