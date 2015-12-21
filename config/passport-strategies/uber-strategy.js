'use strict';
var UberStrategy      = require('passport-uber').Strategy;
var User              = require('../../app/models/user');
var Channel           = require('../../app/models/channel');
var textCrypt         = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:uber');

CONFIG.passReqToCallback = true;

var uberStrategy = new UberStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:uber', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken)}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = uberStrategy;
