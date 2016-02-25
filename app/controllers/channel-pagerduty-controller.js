var User = require('../models/user');
var textCrypt = require('../lib/textCrypt');

function ChannelPagerdutyController(){
  var self = this;

  self.create = function(req, res){
    var token = "token=" + req.body.token;
    console.log('I got token', token)
    User.overwriteOrAddApiByChannelId(req.user, req.params.id, { authtype: 'oauth', token_crypt : textCrypt.encrypt(token)});
    User.update({_id: req.user._id}, req.user).then(function(){
      res.send(201);
    }).catch(function(error){
      console.error(error.stack);
      res.send(422);
    });
  }
}

module.exports = ChannelPagerdutyController;
