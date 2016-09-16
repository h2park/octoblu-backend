'use strict';
var PodioStrategy = require('passport-podio').Strategy;
var User          = require('../../app/models/user');
var Channel       = require('../../app/models/channel');
var textCrypt     = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:podio');

CONFIG.passReqToCallback = true;

var podioStrategy = new PodioStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var expiresIn = 1800;
  if (profile && profile._json && profile._json.push && profile._json.push.expires_in) {
    expiresIn = profile._json.push.expires_in;
  }
  var expiresOn = Date.now() + (expiresIn * 1000);

  User.addApiAuthorization(req.user, 'channel:podio', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken), refreshToken_crypt: textCrypt.encrypt(refreshToken), expiresOn: expiresOn}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = podioStrategy;
