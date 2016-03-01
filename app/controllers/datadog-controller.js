var request = require('request');
var Channel = require('../models/channel');
var User = require('../models/user');
var channelId = '56d4b67307b34be42f07575e';
var textCrypt = require('../lib/textCrypt');

var DatadogController = function(){
  this.authorize = function(req, res, next){
    var apiKey = req.query.apiKey;
    var appKey = req.query.appKey;
    User.overwriteOrAddApiByChannelId(req.user, channelId, {
      "hiddenParams": [
        {
          "name": "api_key",
          "hidden": "true",
          "style": "query",
          "type": "string",
          "value": apiKey
        },
        {
          "style": "query",
          "type": "string",
          "name": "app_key",
          "required": "true",
          "value": appKey
      }
    ]
  });

  User.update({_id: req.user._id}, req.user).then(function(){
    next();
    }).catch(function(error){
      next(error);
    });
  };

  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Datadog');
  };
}

module.exports = DatadogController;
