var request = require('request');
var Channel = require('../models/channel');
var User = require('../models/user');
var channelId = '56b390f3b604c4b06ed6de6a';
var applicationCredentials = Channel.syncFindById(channelId).applicationCredentials;
var textCrypt = require('../lib/textCrypt');

var XenMobileController = function(){
  this.authorize = function(req, res, next){
    var uri = 'https://' + req.query.serverUrl + '/xenmobile/api/v1/authentication/login';
    request.post({
        url: uri,
        json: {
          login: req.query.username,
          password: req.query.password
        }
      }, function(err, httpResponse, body) {
        if (err || !body.auth_token) {
          console.error('XenMobile Auth Failed:', err, body.auth_token);
          res.redirect('/home');
          return;
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
