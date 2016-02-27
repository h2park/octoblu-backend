var _ = require('lodash'),
    when = require('when'),
    whenNode = require('when/node'),
    debug = require('debug')('octoblu:flow-deploy'),
    textCrypt = require('../lib/textCrypt'),
    Channel = require('../models/channel'),
    mongojs = require('mongojs'),
    request = require('request'),
    url = require('url'),
    MeshbluHttp = require('meshblu-http'),
    FlowStatusMessenger = require('./flow-status-messenger');

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

  self.convertFlow = function(flow){
    var convertedNodes = [];

    convertedNodes.push({id: flow.flowId, label: flow.name, type: 'tab', hash: flow.hash});

    _.each(flow.nodes, function(node){
        convertedNodes.push(self.convertNode(flow, node));
    });

    return convertedNodes;
  };

  self.convertNode = function(flow, node){
    var convertedNode, nodeLinks, groupedLinks, largestPort;

    nodeLinks           = _.where(flow.links, {from: node.id});
    groupedLinks        = _.groupBy(nodeLinks, 'fromPort');
    largestPort         = self.largestPortNumber(groupedLinks);

    convertedNode = _.clone(node);
    convertedNode.z = flow.flowId;
    convertedNode.hash = flow.hash;
    convertedNode.wires = self.paddedArray(largestPort);
    if (convertedNode.category === 'operation') {
      convertedNode.type = convertedNode.type.replace('operation:', '');
    } else {
      convertedNode.type = convertedNode.category;
    }

    _.each(groupedLinks, function(links, fromPort){
      var port = parseInt(fromPort);
      convertedNode.wires[port] = _.pluck(links, 'to');
    });

    return convertedNode;
  };

  self.getUser = function () {
    return User.findBySkynetUUID(userUUID);
  };

  self.mergeFlowTokens = function(flow, userApis, channelApis) {
    _.each(flow.nodes, function(node){
      node.oauth = {};
      var userApiMatch, channelApiMatch;
      channelApiMatch = _.findWhere(channelApis, { type : node.type });
      if (channelApiMatch) {
        if (!channelApiMatch.oauth){
          channelApiMatch.oauth = {
            tokenMethod: channelApiMatch.auth_strategy
          };
        }
        if (channelApiMatch.overrides) {
          node.headerParams = _.extend(node.headerParams || {}, channelApiMatch.overrides.headerParams || {});
        }
        var channelOauth = channelApiMatch.oauth[process.env.NODE_ENV] || channelApiMatch.oauth;
        node.application = {base: channelApiMatch.application.base};
        node.bodyFormat = channelApiMatch.bodyFormat;
        node.followAllRedirects = channelApiMatch.followAllRedirects;
        node.skipVerifySSL = channelApiMatch.skipVerifySSL;
        node.hiddenParams = channelApiMatch.hiddenParams;
        node.oauth = _.defaults(node.oauth, channelOauth);
        node.oauth.key = node.oauth.key || node.oauth.clientID || node.oauth.consumerKey;
        node.oauth.secret = node.oauth.secret || node.oauth.clientSecret || node.oauth.consumerSecret;
        node.authHeaderKey = channelApiMatch.auth_header_key;
        // Get User API Match
        userApiMatch = User.findApiByChannel(userApis, channelApiMatch);
        if (!node.bodyParam) {
          node.bodyParam = channelApiMatch.bodyParam;
        }
      }
      if (userApiMatch) {
        if (userApiMatch.token_crypt) {
          userApiMatch.secret = textCrypt.decrypt(userApiMatch.secret_crypt);
          userApiMatch.token = textCrypt.decrypt(userApiMatch.token_crypt);
        }
        node.apikey = userApiMatch.apikey;
        node.oauth.access_token = userApiMatch.token || userApiMatch.key;
        node.oauth.access_token_secret = userApiMatch.secret;
        node.oauth.refreshToken = userApiMatch.refreshToken;
        node.oauth.expiresOn = userApiMatch.expiresOn;
        node.defaultParams = userApiMatch.defaultParams;
      }

    });
    return flow;
  };

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

  self.largestPortNumber = function(groupedLinks){
    var portsKeys = _.keys(groupedLinks);
    var ports = _.map(portsKeys, function(portKey){ return parseInt(portKey); } );
    return _.max(ports);
  };

  self.paddedArray = function(length){
    return _.map(_.range(length), function(){
      return [];
    });
  };

  self.updateMeshbluFlow = function(flow){
    return self.saveMeshbluFlow(flow);
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

  self.saveMeshbluFlow = function(flow) {
    return when.promise(function(resolve, reject){
      var protocol = (config.skynet.port == 443) ? 'https' : 'http';
      var meshbluHttp = new MeshbluHttp({
        protocol: protocol,
        server: config.skynet.host,
        port: config.skynet.port,
        uuid: userUUID,
        token: userToken
      });

      meshbluHttp.update(flow.flowId, {name: flow.name, flow: self.convertFlow(flow), deploying: true, deploymentUuid: flow.deploymentUuid}, function(error, response) {
        debug('update resolved', error, response);
        if(error) { return reject(error); }
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
