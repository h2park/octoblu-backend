'use strict';
var GoToMeetingStrategy = require('passport-citrix').Strategy;
var User                = require('../../app/models/user');
var Channel             = require('../../app/models/channel');
var textCrypt           = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:gotomeeting');

CONFIG.passReqToCallback = true;
CONFIG.name = 'gotomeeting';

var goToMeetingStrategy = new GoToMeetingStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:gotomeeting', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken)}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = goToMeetingStrategy;
