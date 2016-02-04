'use strict';
var ShareFileStrategy = require('passport-sharefile').Strategy;
var User              = require('../../app/models/user');
var Channel           = require('../../app/models/channel');
var textCrypt         = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:sharefile');

CONFIG.passReqToCallback = true;

var sharefileStrategy = new ShareFileStrategy(CONFIG, function(req, accessToken, refreshToken, params, profile, done){
  var expiresOn = Date.now() + (params.expires_in * 1000);

  User.addApiAuthorization(req.user, 'channel:sharefile', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken), refreshToken_crypt: textCrypt.encrypt(refreshToken), expiresOn: expiresOn}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

sharefileStrategy.customRefreshStrategy = function(channelAuth, callback){
  var OAuth2 = sharefileStrategy._oauth2.constructor;
  var domain = channelAuth.defaultParams[':account'];
  if(!domain) return callback(new Error('Missing Domain'));
  var refreshTokenUrl = 'https://'+domain+'.sf-api.com/oauth/token'
  var refreshOAuth2 = new OAuth2(
    sharefileStrategy._oauth2._clientId,
    sharefileStrategy._oauth2._clientSecret,
    sharefileStrategy._oauth2._baseSite,
    sharefileStrategy._oauth2._authorizeUrl,
    refreshTokenUrl,
    sharefileStrategy._oauth2._customHeader
  )

  var params = {
    grant_type:'refresh_token'
  }

  refreshOAuth2.getOAuthAccessToken(channelAuth.refreshToken, params, callback);
};

module.exports = sharefileStrategy;
