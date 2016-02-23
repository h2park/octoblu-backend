var _         = require('lodash');
var request   = require('request');
var async     = require('async');
var Channel   = require('../models/channel');
var User      = require('../models/user');
var channelId = '56b246552b73ae8a5027ce8d';
var textCrypt = require('../lib/textCrypt');

var ClmController = function() {

  var self = this;

  self.companies = function(req, originRes, servername, apiKey, next, callback) {
    var uri = 'https://' + servername + '/v0/companies?client_id=' + encodeURIComponent(apiKey);
    var companiesOptions = {
      url: uri,
      timeout: 1500
    }

    request.get(companiesOptions, function(err, httpResponse, body) {
      if (err || !body) {
        originRes.redirect('/home');
        return;
      }
      try {
        var companies = JSON.parse(body);
        var company = companies[0].companyId;
      } catch(err) {
        callback(err);
      }
      callback(null, req, originRes, servername, company, apiKey, next);
    });
  };

  self.roles = function(req, originRes, servername, company_id, apiKey, next,callback){
    var uri = 'https://' + servername + '/v0/roles?client_id=' + encodeURIComponent(apiKey) + '&company_id=' + company_id;
    var rolesOptions = {
      url: uri
    }

    request.get(rolesOptions, function(err, httpResponse, body) {
      if (err || !body) {
        originRes.redirect('/home');
        return;
      }
      try {
        var roles = JSON.parse(body)[0];
      } catch(err) {
        callback(err);
      }
      callback(null, req, originRes, roles, company_id, next);
    });
  };

  self.finalize = function(req, res, role, company_id, next){
    var auth = 'Basic ' + new Buffer(req.query.apiKey + ':' + req.query.apiSecret, 'utf8').toString('base64');
    var uri = 'https://' + req.query.servername + '/v0/oauth/token';
    var scope = role + ',' + company_id;

    var finalizeOptions = {
      "url": uri,
      "qs": {
        "grant_type": 'client_credentials',
        "scope": scope
      },
      "headers": {
        "Authorization": auth
      }
    };

    request.get(finalizeOptions, function(err, httpResponse, body) {
      if (err || !body) {
        res.redirect('/home');
        return;
      }
      try {
        var json = JSON.parse(body);
      } catch(err) {
        callback(err);
      }

      var auth = {
        authtype: 'oauth',
        token_crypt: textCrypt.encrypt(json.access_token)
      }

      User.overwriteOrAddApiByChannelId(req.user, channelId, auth);
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
    ], function(err, result) {
      if (error) {
        next(error);
      }
      next();
      return;
    });
  };

  self.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Citrix-LifeCycle-Management');
  };
};

module.exports = ClmController;
