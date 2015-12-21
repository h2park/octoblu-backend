'use strict';
var NestStrategy = require('passport-nest').Strategy;
var User         = require('../../app/models/user');
var Channel      = require('../../app/models/channel');
var textCrypt    = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:nest');

CONFIG.passReqToCallback = true;

var nestStrategy = new NestStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:nest', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken)}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = nestStrategy;
