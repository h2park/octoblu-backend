var _                   = require('lodash');
var when                = require('when');
var whenNode            = require('when/node');
var debug               = require('debug')('octoblu:flow-deploy');
var textCrypt           = require('../lib/textCrypt');
var Channel             = require('../models/channel');
var mongojs             = require('mongojs');
var request             = require('request');
var url                 = require('url');
var MeshbluHttp         = require('meshblu-http');
var FlowStatusMessenger = require('./flow-status-messenger');

var FlowDeploy = function(options){
  var User = require('../models/user');

  var self, config, request, userUUID, userToken, meshbluJSON, deploymentUuid;
  self = this;

  options         = options || {};

  userUUID        = options.userUUID;
  userToken       = options.userToken;
  deploymentUuid  = options.deploymentUuid || 'unset';
  config          = options.config  || require('../../config/auth');
  request         = options.request || require('request');
  meshbluJSON     = options.meshbluJSON;

  self.getNanocyteMessageUrl = function(flowId) {
    return config.nanocyteDeployUri + '/flows/' + flowId + '/instances';
  };

  self.getNanocyteOptions = function() {
    return {
      auth: {
        user: userUUID,
        pass: userToken
      },
      headers: {
        deploymentUuid: deploymentUuid
      }
    }
  };

  self.getNanocyteFlowPromise = function(flowId, method) {
    return whenNode.call(method,
      self.getNanocyteMessageUrl(flowId),
      self.getNanocyteOptions());
  };

  self.startNanocyteFlow = function(flow) {
    return self.getNanocyteFlowPromise(flow.flowId, request.post);
  };

  self.stopNanocyteFlow = function(flow){
    return self.getNanocyteFlowPromise(flow.flowId, request.del);
  };

  self.setStopping = function(flow){
    return when.promise(function(resolve, reject){

      var protocol = (config.skynet.port == 443) ? 'https' : 'http';
      var meshbluHttp = new MeshbluHttp({
        protocol: protocol,
        server: config.skynet.host,
        port: config.skynet.port,
        uuid: userUUID,
        token: userToken
      });

      meshbluHttp.update(flow.flowId, {stopping: true, deploying: false}, function(error, response) {
        if (error) {
          return reject(error);
        }
        resolve(response);
      });
    });
  };

  self.setDeploying = function(flow){
    return when.promise(function(resolve, reject){

      var protocol = (config.skynet.port == 443) ? 'https' : 'http';
      var meshbluHttp = new MeshbluHttp({
        protocol: protocol,
        server: config.skynet.host,
        port: config.skynet.port,
        uuid: userUUID,
        token: userToken
      });

      meshbluHttp.update(flow.flowId, {deploying: true, stopping: false}, function(error, response) {
        if (error) {
          return reject(error);
        }
        resolve(response);
      });
    });
  };
};

FlowDeploy.start = function(userUUID, userToken, flow, meshbluJSON, deploymentUuid){
  var flowDeploy, mergedFlow, flowDevice, user, deviceCollection, flowStatusMessenger;

  flowStatusMessenger = new FlowStatusMessenger({
    userUuid:        userUUID,
    userToken:       userToken,
    flowUuid:        flow.flowId,
    deploymentUuid:  deploymentUuid,
    workflow:        'flow-start'
  });

  flowStatusMessenger.message('begin');

  flowDeploy = new FlowDeploy({userUUID: userUUID, userToken: userToken, meshbluJSON: meshbluJSON, deploymentUuid: deploymentUuid});

  if (flow) {
    return flowDeploy.setDeploying(flow).then(function(){
      return flowDeploy.startNanocyteFlow(flow);
    }).then(function(){
      flowStatusMessenger.message('end');
    }).catch(function(error){
      flowStatusMessenger.message('error', error.message);
      debug(error.stack);
    });
  }
};

FlowDeploy.stop = function(userUUID, userToken, flow, meshbluJSON, deploymentUuid){
  var flowDeploy, flowDevice, flowStatusMessenger;
  if(flow == null) {
    return when.reject(new Error('Missing flow to stop'))
  }
  flowStatusMessenger = new FlowStatusMessenger({
    userUuid:        userUUID,
    userToken:       userToken,
    flowUuid:        flow.flowId,
    deploymentUuid:  deploymentUuid,
    workflow:        'flow-stop'
  });

  flowStatusMessenger.message('begin');

  flowDeploy = new FlowDeploy({userUUID: userUUID, userToken: userToken, meshbluJSON: meshbluJSON, deploymentUuid: deploymentUuid});

  return flowDeploy.setStopping(flow).then(function(){
    return flowDeploy.stopNanocyteFlow(flow);
  }).then(function(){
    flowStatusMessenger.message('end');
  }).catch(function(error){
    flowStatusMessenger.message('error', error.message);
    debug(error.stack);
  });
};

module.exports = FlowDeploy;
