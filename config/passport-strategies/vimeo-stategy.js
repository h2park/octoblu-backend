'use strict';
var VimeoStrategy = require('passport-vimeo').Strategy;
var User          = require('../../app/models/user');
var Channel       = require('../../app/models/channel');
var textCrypt     = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:vimeo');

CONFIG.passReqToCallback = true;

var vimeoStrategy = new VimeoStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:vimeo', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken)}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = vimeoStrategy;
