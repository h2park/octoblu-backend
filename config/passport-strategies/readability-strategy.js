'use strict';
var ReadabilityStrategy = require('passport-readability').Strategy;
var User                = require('../../app/models/user');
var Channel             = require('../../app/models/channel');
var textCrypt           = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:readability');

CONFIG.passReqToCallback = true;

var readabilityStrategy = new ReadabilityStrategy(CONFIG, function(req, accessToken, secret, profile, done){

  User.addApiAuthorization(req.user, 'channel:readability', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken), secret_crypt: textCrypt.encrypt(secret)}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = readabilityStrategy;
