var request = require('request');
var Channel = require('../models/channel');
var User = require('../models/user');
var channelId = '56b390f3b604c4b06ed6de6a';
var textCrypt = require('../lib/textCrypt');

var XenMobileController = function(){
  var cleanupAndRespondWithError = function(req, res, message){
    console.error(message);

    User.removeApiByChannelId(req.user, channelId).then(function(){
      res.status(400).send({error: {message: message}});
    }, function(){
      res.send(500, {
        error: {
          message: 'Upstream Error, failed to cleanup channel activation',
          upstreamError: {
            message: message
          }
        }
      });
    });
  };

  this.authorize = function(req, res, next){
    var uri = req.query.serverUrl + '/xenmobile/api/v1/authentication/login';
    request.post({
        url: uri,
        json: {
          login: req.query.username,
          password: req.query.password
        }
      }, function(err, httpResponse, body) {
        if (err) {
          var message = 'XenMobile Auth Failed: ' + JSON.stringify(err.message);
          return cleanupAndRespondWithError(req, res, message);
        }

        if (!body.auth_token) {
          var message = 'XenMobile Auth Failed: ' + JSON.stringify(body);
          return cleanupAndRespondWithError(req, res, message);
        }

        User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'header', token_crypt: textCrypt.encrypt(body.auth_token), headerParam: 'auth_token'});
        User.update({_id: req.user._id}, req.user).then(function(){
          next();
        }).catch(function(error){
          next(error);
        });
    });
  };
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=XenMobile');
  };
};

module.exports = XenMobileController;
