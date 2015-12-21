var request = require('request');
var when = require('when');
var Channel = require('../models/channel');
var User = require('../models/user');
var textCrypt = require('../lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:travis-ci-pro');

function authenticate(token){
  return when.promise(function(resolve, reject){
    request.post({
        json : {'github_token' : token},
        headers: {
          'User-Agent': 'Octoblu/1.0.0',
          'Accept': 'application/vnd.travis-ci.2+json'
        },
        url: 'https://api.travis-ci.com/auth/github'
      }, function(err, httpResponse, body) {
        if(err){
          return reject(err)
        }
        if (!body.access_token){
          return reject(new Error('Failed to authenticate with Travis CI'));
        }
        resolve(body.access_token);
    });
  });
}

var TravisCIProController = function(){
  this.authorize = function(req, res, next){
    var channel = User.findApiByChannelType(req.user.api, 'channel:github');
    authenticate(channel.token)
      .then(function(accessToken){
        User.addApiAuthorization(req.user, 'channel:travis-ci-pro', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken)})
          .then(function () {
            next(null, req.user);
          }).catch(function(error){
            next(error);
          });
      }, next);
  };
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Travis-CI-Pro');
  };
};

module.exports = TravisCIProController;
