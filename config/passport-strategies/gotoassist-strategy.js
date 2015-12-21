'use strict';
var GoToAssistStrategy = require('passport-citrix').Strategy;
var User               = require('../../app/models/user');
var Channel            = require('../../app/models/channel');
var textCrypt          = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:gotoassist');

CONFIG.passReqToCallback = true;
CONFIG.name = 'gotoassist';

var goToAssistStrategy = new GoToAssistStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:gotoassist', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken)}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = goToAssistStrategy;
