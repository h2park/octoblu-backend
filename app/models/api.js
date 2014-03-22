'use strict';

var mongoose = require('mongoose');

// define the schema for our user model
var ApiSchema = mongoose.Schema({
    name: String,
    owner: String,
    description: String,
    enabled: Boolean,
    logo: String,
    logobw: String,
    auth_strategy: String, // options: oauth, simple (user enters token), custom (use custom tokens), none (requires no authorization)
    custom_tokens: [{ name: String }],
    oauth: {
        key: String,
        clientId: String,
        secret: String,
        accessTokenURL: String,
        requestTokenURL: String,
        authTokenURL: String,
        version: String,
        baseURL: String,
        authTokenPath: String
    },
    documentation: String,
    application: { base: String, resources: [] }
});

mongoose.model('Api', ApiSchema);

module.exports = ApiSchema;
