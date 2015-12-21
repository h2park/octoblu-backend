'use strict';
var QuickBooksStrategy = require('passport-intuit-oauth').Strategy;
var User               = require('../../app/models/user');
var Channel            = require('../../app/models/channel');
var textCrypt            = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:quickbooks');

CONFIG.passReqToCallback = true;

var quickBooksStrategy = new QuickBooksStrategy(CONFIG, function(req, accessToken, secret, profile, done){

  User.addApiAuthorization(req.user, 'channel:quickbooks', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken), secret_crypt: textCrypt.encrypt(secret)}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = quickBooksStrategy;
