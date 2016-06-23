'use strict';
var SmartsheetStrategy = require('passport-smartsheet').Strategy;
var User               = require('../../app/models/user');
var Channel            = require('../../app/models/channel');
var textCrypt          = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:smartsheet');

CONFIG.passReqToCallback = true;

var smartsheetStrategy = new SmartsheetStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:smartsheet', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken)}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = smartsheetStrategy;
