'use strict';
var SpotifyStrategy = require('passport-spotify').Strategy;
var User            = require('../../app/models/user');
var Channel         = require('../../app/models/channel');
var textCrypt       = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:spotify');

CONFIG.passReqToCallback = true;

var spotifyStrategy = new SpotifyStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var expiresIn = 1800;
  if (profile && profile.expires_in) {
    expiresIn = profile.expires_in;
  }
  var expiresOn = Date.now() + (expiresIn * 1000);

  User.addApiAuthorization(req.user, 'channel:spotify', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken), refreshToken_crypt: textCrypt.encrypt(refreshToken), expiresOn: expiresOn}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = spotifyStrategy;
