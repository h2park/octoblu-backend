'use strict';
var SlackStrategy     = require('passport-slack').Strategy;
var User              = require('../../app/models/user');
var Channel           = require('../../app/models/channel');
var textCrypt         = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:slack');

CONFIG.scope = 'bot'
CONFIG.passReqToCallback = true;
CONFIG.scope = [
  'channels:history',
  'channels:read',
  'channels:write',
  'chat:write:bot',
  'chat:write:user',
  'dnd:read',
  'dnd:write',
  'emoji:read',
  'files:read',
  'files:write:user',
  'groups:history',
  'groups:read',
  'groups:write',
  'im:history',
  'im:read',
  'im:write',
  'mpim:history',
  'mpim:read',
  'mpim:write',
  'pins:read',
  'pins:write',
  'reactions:read',
  'reactions:write',
  'search:read',
  'stars:read',
  'stars:write',
  'team:read',
  'usergroups:read',
  'usergroups:write',
  'users.profile:read',
  'users.profile:write',
  'users:read',
  'users:write',
];

var slackStrategy = new SlackStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  User.addApiAuthorization(req.user, 'channel:slack', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken)}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = slackStrategy;
