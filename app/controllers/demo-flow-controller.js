'use strict';
var _        = require('lodash');
var demoFlow = require('../../assets/flows/demo-flow.json');
var User     = require('../models/user');
var when     = require('when');

var DemoFlowController = function (options) {
  var self, meshblu, Flow;
  self = this;

  options = options || {};

  Flow    = options.Flow || require('../models/flow');
  meshblu = options.meshblu;

  self.create = function (req, res) {
    var user = req.user;
    when.all([
      User.addApiAuthorization(user, 'channel:weather', {authtype: 'none'}),
      User.addApiAuthorization(user, 'channel:stock-price', {authtype: 'none'}),
      User.addApiAuthorization(user, 'channel:sms-send', {authtype: 'basic', token : user.skynet.uuid, secret : user.skynet.token }),
      User.addApiAuthorization(user, 'channel:email', {authtype: 'basic', token : user.skynet.uuid, secret : user.skynet.token})
    ]).then(function(){
      Flow.createByUserUUID(user.resource.uuid, demoFlow, meshblu).then(function(flow){
        res.send(201, flow);
      }).catch(function(error) {
        res.send(422, error);
      });
    });
  };
}

module.exports = DemoFlowController;
