'use strict';
var ThingiverseStrategy = require('passport-thingiverse').Strategy;
var User                = require('../../app/models/user');
var Channel             = require('../../app/models/channel');
var textCrypt           = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:thingiverse');

CONFIG.passReqToCallback = true;

var thingiverseStrategy = new ThingiverseStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:thingiverse', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken)}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = thingiverseStrategy;
