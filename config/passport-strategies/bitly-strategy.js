'use strict';
var BitlyStrategy = require('passport-bitly').Strategy;
var User          = require('../../app/models/user');
var Channel       = require('../../app/models/channel');
var textCrypt     = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:bitly');

CONFIG.passReqToCallback = true;

var bitlyStrategy = new BitlyStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:bitly', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken)}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = bitlyStrategy;
