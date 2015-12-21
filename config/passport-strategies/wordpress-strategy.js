'use strict';
var WordPressStrategy = require('passport-wordpress').Strategy;
var User              = require('../../app/models/user');
var Channel           = require('../../app/models/channel');
var textCrypt = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:wordpress');

CONFIG.passReqToCallback = true;

var wordpressStrategy = new WordPressStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:wordpress', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken)}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = wordpressStrategy;
