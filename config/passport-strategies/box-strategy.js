'use strict';
var BoxStrategy = require('passport-box').Strategy;
var User        = require('../../app/models/user');
var Channel     = require('../../app/models/channel');
var textCrypt   = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:box');

CONFIG.passReqToCallback = true;

var boxStrategy = new BoxStrategy(CONFIG, function(req, accessToken, refreshToken, params, profile, done){
  var expiresOn = Date.now() + (params.expires_in * 1000);

  User.addApiAuthorization(req.user, 'channel:box', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken), refreshToken_crypt: textCrypt.encrypt(refreshToken), expiresOn: expiresOn}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = boxStrategy;
