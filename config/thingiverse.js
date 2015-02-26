'use strict';
var ThingiverseStrategy = require('passport-thingiverse').Strategy;
var User                = require('../app/models/user');
var Channel             = require('../app/models/channel');

var CONFIG = Channel.syncFindOauthConfigByType('channel:thingiverse');

CONFIG.passReqToCallback = true;

var thingiverseStrategy = new ThingiverseStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:thingiverse', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = thingiverseStrategy;
