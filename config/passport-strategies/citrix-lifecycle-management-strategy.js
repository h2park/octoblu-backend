'use strict';
var ClmStrategy = require('passport-citrix').Strategy;
var User        = require('../../app/models/user');
var Channel     = require('../../app/models/channel');
var textCrypt   = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:citrixlifecyclemanagement');

CONFIG.passReqToCallback = true;
CONFIG.name = 'citrixlifecyclemanagement';

var clmStrategy = new ClmStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:citrixlifecyclemanagement', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken)}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = clmStrategy;
