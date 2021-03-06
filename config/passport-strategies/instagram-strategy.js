'use strict';
var InstagramStrategy = require('passport-instagram').Strategy;
var User              = require('../../app/models/user');
var Channel           = require('../../app/models/channel');
var textCrypt         = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:instagram');

CONFIG.passReqToCallback = true;

var instagramStrategy = new InstagramStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:instagram', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken)}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = instagramStrategy;
