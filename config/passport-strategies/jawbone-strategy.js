'use strict';
var JawboneStrategy = require('passport-jawbone').Strategy;
var User            = require('../../app/models/user');
var Channel         = require('../../app/models/channel');
var textCrypt       = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:jawbone');

CONFIG.passReqToCallback = true;

var jawboneStrategy = new JawboneStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:jawbone', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken)}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = jawboneStrategy;
