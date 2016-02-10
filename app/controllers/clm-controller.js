var request = require('request');
var Channel = require('../models/channel');
var User = require('../models/user');
var channelId = '56b390f3b604c4b06ed6de6a';
// var applicationCredentials = Channel.syncFindById(channelId).applicationCredentials;
var textCrypt = require('../lib/textCrypt');

var ClmController = function(){
  this.authorize = function(req, res, next){
    var uri = 'https://' + req.query.servername + '/v0/companies?client_id=' + req.query.apiKey;
    request.get({
        url: uri
      }, function(err, httpResponse, body) {
        if (err || !body.companyId) {
          console.error('Auth failed:', err, body.companyId);
          res.redirect('/home');
          return;
        }
        User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth', token_crypt: textCrypt.encrypt(body.auth_token), headerParam: 'auth_token'});
        User.update({_id: req.user._id}, req.user).then(function(){
          next();
        }).catch(function(error){
          next(error);
        });
    });
  };
  this.companies = function(req, res, next){
    var uri = 'https://' + req.query.servername + '/v0/companies?client_id=' + req.query.apiKey;
    request.get({
        url: uri
      }, function(err, httpResponse, body) {
        if (err || !body.companyId) {
          console.error('Auth failed:', err, body.companyId);
          res.redirect('/home');
          return;
        }
        User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth', token_crypt: textCrypt.encrypt(body.auth_token), headerParam: 'auth_token'});
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

module.exports = ClmController;
