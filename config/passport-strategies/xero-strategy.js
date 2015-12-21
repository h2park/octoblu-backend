'use strict';
var XeroStrategy = require('passport-xero').Strategy;
var User     = require('../../app/models/user');
var Channel = require('../../app/models/channel');
var textCrypt = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:xero');

CONFIG.passReqToCallback = true;

var xeroStrategy = new XeroStrategy(CONFIG, function(req, accessToken, secret, profile, done){
  User.addApiAuthorization(req.user, 'channel:xero', {authtype: 'oauth',  token_crypt: textCrypt.encrypt(accessToken), secret_crypt: textCrypt.encrypt(secret)}).then(function(){
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = xeroStrategy;
