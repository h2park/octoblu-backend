var _         = require('lodash');
var request   = require('request');
var async     = require('async');
var Channel   = require('../models/channel');
var User      = require('../models/user');
var channelId = '56b246552b73ae8a5027ce8d';
var textCrypt = require('../lib/textCrypt');

var ClmController = function() {

  var self = this;

  self.companies = function(req, originRes, servername, apiKey, next, callback){
    var uri = 'https://' + servername + '/v0/companies?client_id=' + apiKey;
    request.get({
        url: uri,
        timeout: 1500
      }, function(err, httpResponse, body) {
        body = JSON.parse(body);
        if (err || !body[0].companyId) {
          originRes.redirect('/home');
          return;
        }
        callback(null, req, originRes, servername, body[0].companyId, apiKey, next);
    });
  };

  self.roles = function(req, originRes, servername, company_id, apiKey, next,callback){
    var uri = 'https://' + servername + '/v0/roles?client_id=' + apiKey + '&company_id=' + company_id;
    request.get({
        url: uri
      }, function(err, httpResponse, body) {
        if (err || !body) {
          originRes.redirect('/home');
          return;
        }
        callback(null, req, originRes, JSON.parse(body)[0], company_id, next);
    });
  };

  self.finalize = function(req, res, role, company_id, next){
    var auth = 'Basic ' + new Buffer(req.query.apiKey + ':' + req.query.apiSecret, 'utf8').toString('base64');
    var uri = 'https://' + req.query.servername + '/v0/oauth/token';
    var sc = role + ',' + company_id;

    request.get({
        "url": uri,
        "qs": {
          "grant_type": 'client_credentials',
          "scope": sc
        },
        "headers": {
          "Authorization": auth
        }
      }, function(err, httpResponse, body) {
        body = JSON.parse(body);
        if (err || !body.access_token) {
          res.redirect('/home');
          return;
        }
        User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth', token_crypt: textCrypt.encrypt(body.access_token)});
        User.update({_id: req.user._id}, req.user).then(function(){
          next();
        }).catch(function(error){
          next(error);
        });
    });
  };

  self.authorize = function(req, res, next) {

    async.waterfall([
      async.apply(self.companies, req, res, req.query.servername, req.query.apiKey, next),
      self.roles,
      self.finalize
    ]);

  };

  self.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Citrix-LifeCycle-Management');
  };
};

module.exports = ClmController;
