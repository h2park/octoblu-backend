var request = require('request');
var Channel = require('../models/channel');
var User = require('../models/user');
var channelId = '59243057pufsdh3453p49';
// var applicationCredentials = Channel.syncFindById(channelId).applicationCredentials;
var textCrypt = require('../lib/textCrypt');

var DataDogController = function(){
  this.authorize = function(req, res, next){

        User.overwriteOrAddApiByChannelId(req.user, channelId, {
          "hiddenParams": [{
          "name": "api-key",
          "hidden": "true",
          "style": "query",
          "type": "string",
          "value": req.query.api-key
        },
        {
          "style": "query",
          "type": "string",
          "value": req.query.app-key,
          "name": "app-key",
          "required": "true"
        }]
      });
        User.update({_id: req.user._id}, req.user).then(function(){
          next();
        }).catch(function(error){
          next(error);
        });
    });
  };
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=DataDog');
  };
};

module.exports = DataDogController;
