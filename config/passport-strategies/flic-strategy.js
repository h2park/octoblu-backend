'use strict';
var FlicStrategy = require('passport-flic').Strategy;
var User         = require('../../app/models/user');
var Channel      = require('../../app/models/channel');
var _            = require('lodash');

var CONFIG = Channel.syncFindOauthConfigByType('channel:flic');

CONFIG.passReqToCallback = true;

var flicStrategy = new FlicStrategy(CONFIG, function(req, accessToken, secret, profile, done){
  User.addApiAuthorization(req.user, 'channel:flic', {authtype: 'oauth', token: accessToken, secret: secret}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = flicStrategy;
