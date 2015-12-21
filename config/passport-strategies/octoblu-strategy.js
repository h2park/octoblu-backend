'use strict';
var OctobluStrategy = require('passport-octoblu').Strategy;
var User            = require('../../app/models/user');
var Channel         = require('../../app/models/channel');
var textCrypt       = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:octoblu');

CONFIG.passReqToCallback = true;

var octobluStrategy = new OctobluStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:octoblu', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken)}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = octobluStrategy;
