var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var apiSchema = mongoose.Schema({

    name             : String,
    owner            : String,
    description      : String,
    enabled          : Boolean,
    logo             : String,
    logobw           : String,
    auth_strategy    : String, // options: oauth, simple (user enters token), custom (use custom tokens), none (requires no authorization)
    custom_tokens    : [{name: String}],
    key              : String,
    secret           : String,
    accessTokenURL   : String,
    requestTokenURL  : String,
    accessTokenURL   : String,
    authTokenURL     : String,
    documentation    : String,
    application      : { base: String, resources: [ ] }

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Api', apiSchema);