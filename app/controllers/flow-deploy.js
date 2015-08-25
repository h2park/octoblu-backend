var FlowDeploy = function (options) {
  var FlowDeploy, self, Flow, _, meshblu;

  self = this;
  options = options || {};
  FlowDeploy = options.FlowDeploy || require('../models/flow-deploy');
  meshblu = options.meshblu;
  _ = require('lodash');
  Flow = options.Flow || require('../models/flow');

  self.startInstance = function (req, res) {
    self.runOnInstance(req, FlowDeploy.start, true);
    res.send(201);
  };

  self.stopInstance = function (req, res) {
    self.runOnInstance(req, FlowDeploy.stop, false);
    res.send(200);
  };

  self.restartInstance = function (req, res) {
    self.runOnInstance(req, FlowDeploy.restart, true);
    res.send(200);
  };

  self.runOnInstance = function (req, cmd, activated) {
    var userUUID, userToken;

    userUUID = req.uuid;
    userToken = req.token;
    deploymentUuid = req.get('deploymentUuid');

    Flow.getFlow(req.params.id)
      .then(function (flow) {
        Flow.updateByFlowIdAndUser(flow.flowId, userUUID, {activated: activated});
        cmd(userUUID, userToken, flow, meshblu, deploymentUuid);
      });
  };

  return this;
};

module.exports = FlowDeploy;
