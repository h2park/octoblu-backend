'use strict';
var FourSquare = require('passport-foursquare').Strategy;
var User       = require('../../app/models/user');
var Channel    = require('../../app/models/channel');
var when       = require('when');
var textCrypt   = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:foursquare');

CONFIG.passReqToCallback = true;

var fourSquareStrategy = new FourSquare(CONFIG, function(req, accessToken, refreshToken, profile, done){

when.all([
  User.addApiAuthorization(req.user, 'channel:foursquare', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken)}),
  User.addApiAuthorization(req.user, 'channel:swarm', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken)})
    ]).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = fourSquareStrategy;
