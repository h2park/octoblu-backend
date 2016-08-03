'use strict';
var _                  = require('lodash')
var SalesForceStrategy = require('passport-forcedotcom').Strategy;
var User               = require('../../app/models/user');
var Channel            = require('../../app/models/channel');
var textCrypt          = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:salesforce');

CONFIG.passReqToCallback = true;
CONFIG.scope = ['id','chatter_api', 'api', 'full', 'refresh_token', 'visualforce', 'web'];

var salesForceStrategy = new SalesForceStrategy(CONFIG, function(req, accessTokenResponse, refreshToken, profile, done){
  var accessToken = _.get(accessTokenResponse, 'params.access_token')
  if (!accessToken) {
    console.error(JSON.stringify(accessTokenResponse, null, 2))
    done(new Error('Invalid Access Token'))
    return
  }
  var expiresIn = 3600;
  if (profile && profile.expires_in) {
    expiresIn = profile.expires_in;
  }
  var expiresOn = Date.now() + (expiresIn * 1000);

  User.addApiAuthorization(req.user, 'channel:salesforce', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken), refreshToken_crypt: textCrypt.encrypt(refreshToken), expiresOn: expiresOn}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = salesForceStrategy;
