'use strict';
var AppNetStrategy = require('passport-appdotnet').Strategy;
var User     = require('../../app/models/user');
var Channel = require('../../app/models/channel');
var textCrypt   = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:app.net');

CONFIG.tokenURL = 'https://account.app.net/oauth/access_token';
CONFIG.authorizationURL = 'https://account.app.net/oauth/authenticate';
CONFIG.passReqToCallback = true;

var appNetStrategy = new AppNetStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:app.net', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken)}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = appNetStrategy;
