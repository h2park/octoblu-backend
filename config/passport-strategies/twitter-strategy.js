'use strict';
var TwitterStrategy = require('passport-twitter').Strategy;
var User            = require('../../app/models/user');
var Channel         = require('../../app/models/channel');
var _               = require('lodash');
var textCrypt       = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:twitter');

CONFIG.passReqToCallback = true;

var ensureUser = function(req, user, profile, callback){
  if(user){ return callback(null, user); }
  var query, userParams;

  query = {'twitter.id': profile.id};

  userParams = {
    username:    profile.username,
    displayName: profile.username,
    email:       profile.username,
    twitter: {
      id: profile.id
    }
  };

  User.findOne(query).then(function(user) {
    if (!_.isEmpty(user)){
      var updatedUser = _.extend({}, user, userParams);
      User.update({_id:user._id}, updatedUser);
      callback(null, updatedUser);
      return;
    }

    if (!req.session.sqrtofsaturn && process.env.INVITATION_REQUIRED && !req.session.testerId) {
      callback(new Error('You must have a valid invitation code'));
      return;
    }

    User.createOAuthUser(userParams).then(function(user){
      callback(null, user);
    });

  }).catch(function(error){
    callback(error);
  });
};

var twitterStrategy = new TwitterStrategy(CONFIG,
  function (req, token, secret, profile, done) {
  ensureUser(req, req.user, profile, function(err, user){
    if(err){ return done(err, user); }

    User.addApiAuthorization(user, 'channel:twitter', {authtype: 'oauth', token_crypt: textCrypt.encrypt(token), secret_crypt: textCrypt.encrypt(secret)}).then(function(){
      done(null, user);
    }).catch(function(error){
      done(error);
    });
  });
});

module.exports = twitterStrategy;
