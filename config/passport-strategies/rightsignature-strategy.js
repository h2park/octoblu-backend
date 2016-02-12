'use strict';
var RightSignatureStrategy = require('passport-rightsignature').Strategy;
var User = require('../../app/models/user');
var Channel = require('../../app/models/channel');
var textCrypt    = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:rightsignature');

CONFIG.passReqToCallback = true;

var rightsignatureStrategy = new RightSignatureStrategy(CONFIG, function(req, token, tokenSecret, profile, done) {

  User.addApiAuthorization(req.user, 'channel:rightsignature', {
    authtype: 'oauth',
    token_crypt: textCrypt.encrypt(token),
    secret_crypt: textCrypt.encrypt(tokenSecret)
  }).then(function() {
    done(null, req.user);
  }).catch(function(error) {
    done(error);
  });
});

module.exports = rightsignatureStrategy;
