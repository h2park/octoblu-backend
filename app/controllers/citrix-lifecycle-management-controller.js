var _ = require('lodash');
var request = require('request');
var Channel = require('../models/channel');
var User = require('../models/user');
var channelId = '56b246552b73ae8a5027ce8d';
var textCrypt = require('../lib/textCrypt');

var ClmController = function() {

  var self = this;

  self.companies = function(originRes, servername, apiKey){
    var uri = 'https://' + servername + '/v0/companies?client_id=' + apiKey;
    request.get({
        url: uri,
        timeout: 1500
      }, function(err, httpResponse, body) {
        if (err || !body.companyId) {
          console.error('Auth failed:', err, body.companyId);
          originRes.redirect('/home');
          return;
        }
        return body;
    });
  };

  self.roles = function(originRes, servername, company_id, apiKey){
    var uri = 'https://' + servername + '/v0/roles?client_id=' + apiKey + '&company_id=' + company_id;
    request.get({
        url: uri
      }, function(err, httpResponse, body) {
        if (err || !body) {
          console.error('Auth failed:', err, body);
          originRes.redirect('/home');
          return;
        }
        return body;
    });
  };

  self.authorize = function(req, res, next){
    var company_id = self.companies(res, req.query.servername, req.query.apiKey);
    var role = _.first(self.roles(res, req.query.servername, company_id, req.query.apiKey));
    var auth = 'Basic ' + new Buffer(req.query.apiKey).toString('base64');

    var uri = 'https://' + req.query.servername + '/oauth/token?grant_type=client_credentials&scope=' + role + ',' + company_id;

    request.get({
        url: uri,
        headers: {
          Authorization: auth
        },
      }, function(err, httpResponse, body) {
        if (err || !body.value) {
          console.error('Auth failed:', err, body.value);
          res.redirect('/home');
          return;
        }
        User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth', token_crypt: textCrypt.encrypt(body.value)});
        User.update({_id: req.user._id}, req.user).then(function(){
          next();
        }).catch(function(error){
          next(error);
        });
    });
  };

  self.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Citrix-LifeCycle-Management');
  };
};

module.exports = ClmController;
