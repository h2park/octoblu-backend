var request   = require('request');
var User      = require('../models/user');
var textCrypt = require('../lib/textCrypt');
var channelId = '';



var PagerDutyController = function(){
  this.authorize = function(req, res, next) {
    var token = req.query.token;
    request.get({
      headers: {
        'Authorization': 'Token token=' + token
      },
      url: 'https://acme.pagerduty.com/api/v1/schedules/P4MHU96/entries'
    }, function(err, httpResponse, body) {
      if(err) {
        console.error('Failed to Auth with PagerDuty', err, body.auth_token);
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
    res.redirect('/configure?added=PagerDuty');
  };
};

module.exports = PagerDutyController;
