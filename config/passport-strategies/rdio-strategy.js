'use strict';
var RdioStrategy = require('passport-rdio-oauth2').Strategy;
var User         = require('../../app/models/user');
var Channel      = require('../../app/models/channel');

var CONFIG = Channel.syncFindOauthConfigByType('channel:rdio');

CONFIG.passReqToCallback = true;

var rdioStrategy = new RdioStrategy(CONFIG, function(req, accessToken, secret, profile, done){
  User.addApiAuthorization(req.user, 'channel:rdio', {authtype: 'oauth', token: accessToken, secret: secret}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = rdioStrategy;
