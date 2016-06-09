var When = require('when');

var FlowDeploy = function (options) {
  var FlowDeploy, self, Flow, _, meshbluJSON;

  self = this;
  options = options || {};
  FlowDeploy = options.FlowDeploy || require('../models/flow-deploy');
  meshbluJSON = options.meshbluJSON;
  _ = require('lodash');
  Flow = options.Flow || require('../models/flow');

  self.startInstance = function (req, res) {
    self.runOnInstance(req, FlowDeploy.start, true).then(function(){
      res.send(201);
    }).catch(function(error){
      res.send(500, error.message);
    });
  };

  self.stopInstance = function (req, res) {
    self.runOnInstance(req, FlowDeploy.stop, false).then(function(){
      res.send(204);
    }).catch(function(error){
      res.send(500, error.message);
    });
  };

  self.runOnInstance = function (req, cmd, activated) {
    var userUUID, userToken, config;

    userUUID = req.uuid;
    userToken = req.token;
    deploymentUuid = req.get('deploymentUuid');

    config = _.extend({}, meshbluJSON, {uuid: userUUID, token: userToken});
    return Flow.getFlow(req.params.id, config)
      .then(function (flow) {
        return Flow.updateByFlowIdAndUser(flow.flowId, userUUID, {activated: activated})
      }).then(function(flow){
        if (!activated) {
          return When.resolve(flow);
        }
        return Flow.updateForDeploy(flow, config);
      }).then(function(flow){
        return cmd(userUUID, userToken, flow, meshbluJSON, deploymentUuid);
      });
  };

  return this;
};

module.exports = FlowDeploy;
