'use strict';
var RedboothStrategy = require('passport-redbooth').Strategy;
var User             = require('../../app/models/user');
var Channel          = require('../../app/models/channel');
var textCrypt        = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:redbooth');

CONFIG.passReqToCallback = true;

var redboothStrategy = new RedboothStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:redbooth', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken)}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = redboothStrategy;
