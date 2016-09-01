var _ = require('lodash');

module.exports = function (options) {
  var self = this;
  var meshbluJSON, Flow;

  options = options || {};

  Flow    = options.Flow || require('../models/flow');
  meshbluJSON = options.meshbluJSON;

  self.create = function (req, res) {
    Flow.createByUserUUID(req.user.resource.uuid, req.body, meshbluJSON).then(function(flow){
      res.send(201, flow);
    }, function(error) {
      res.send(422, error);
    });
  };

  self.update = function (req, res) {
    config = _.extend({}, meshbluJSON, {token: req.token, uuid: req.uuid});
    Flow.updateByFlowIdAndUser(req.params.id, req.user.resource.uuid, req.body, config).then(function () {
      res.send(204)
    }, function (error) {
      res.send(422, error);
    });
  };

  self.getAllFlows = function (req, res) {
    config = _.extend({}, meshbluJSON, {token: req.token, uuid: req.uuid});
    return Flow.getFlows(req.user.resource.uuid, config).then(function(flows){
      res.send(flows);
    }, function(error){
      res.sendError(error);
    });
  };

  self.getSomeFlows = function (req, res) {
    return Flow.someFlows(req.user.resource.uuid, req.params.limit, function(flows){
      res.send(flows);
    }, function(error){
      res.sendError(error);
    });
  };

  self.getFlow = function (req, res) {
    config = _.extend({}, meshbluJSON, {token: req.token, uuid: req.uuid});
    return Flow.getFlowWithOwner(req.params.id, req.user.resource.uuid, config).then(function(flow){
      if (!flow) {
        return res.status(404).json({error: 'Flow not found'});
      }

      res.send(flow);
    }, function(error){
      res.sendError(error);
    });
  };

  self.delete = function (req, res) {
    Flow.deleteByFlowIdAndUser(req.params.id, req.uuid, req.token, meshbluJSON)
      .then(function(){
        res.send(204);
      }, function (error) {
        res.sendError(error);
      });
  };

  return self;
};
