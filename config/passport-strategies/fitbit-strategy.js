'use strict';
var FitbitStrategy = require('passport-fitbit').Strategy;
var User           = require('../../app/models/user');
var Channel        = require('../../app/models/channel');
var textCrypt      = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:fitbit');

CONFIG.passReqToCallback = true;

var fitbitStrategy = new FitbitStrategy(CONFIG, function(req, accessToken, secret, profile, done){

  User.addApiAuthorization(req.user, 'channel:fitbit', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken), secret_crypt: textCrypt.encrypt(secret)}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = fitbitStrategy;
