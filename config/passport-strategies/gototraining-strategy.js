'use strict';
var GoToTrainingStrategy = require('passport-citrix').Strategy;
var User                 = require('../../app/models/user');
var Channel              = require('../../app/models/channel');
var textCrypt            = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:gototraining');

CONFIG.passReqToCallback = true;
CONFIG.name = 'gototraining';

var goToTrainingStrategy = new GoToTrainingStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:gototraining', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken)}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = goToTrainingStrategy;
