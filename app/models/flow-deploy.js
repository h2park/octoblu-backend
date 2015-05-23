var _ = require('lodash'),
    when = require('when'),
    debug = require('debug')('octoblu:flow-deploy'),
    textCrypt = require('../lib/textCrypt'),
    Channel = require('../models/channel'),
    mongojs = require('mongojs'),
    request = require('request'),
    url = require('url');

var FlowDeploy = function(options){
  var User = require('../models/user');

  var self, config, request, userUUID, userToken, meshblu;
  self = this;

  options         = options || {};

  userUUID        = options.userUUID;
  userToken       = options.userToken;
  config          = options.config  || require('../../config/auth');
  request         = options.request || require('request');
  meshblu         = options.meshblu;

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
        node.oauth.refreshToken = userApiMatch.refreshToken
        node.oauth.expiresOn = userApiMatch.expiresOn
        node.defaultParams = userApiMatch.defaultParams;
      }

    });
    return flow;
  };

  self.startFlow = function(flow){
    self.updateMeshbluFlow(flow).then(function(){
      self.sendMessage(flow, 'nodered-instance-start');
      //self.startFlowDeploy(flow);
    });
  };

  self.startFlowDeploy = function(flow) {
    var url = config.flowDeployUri + '/flows/' + flow.flowId + '/instance';
    var options = {
      auth: {
        user: userUUID,
        pass: userToken
      }
    };
    request.post(url, options);
  }

  self.stopFlow = function(flow){
    self.sendMessage(flow, 'nodered-instance-stop');
    var url = config.flowDeployUri + '/flows/' + flow.flowId + '/instance';
    var options = {
      auth: {
        user: userUUID,
        pass: userToken
      }
    };
    request.del(url, options);
  };

  self.sendMessage = function(flow, topic) {
    meshblu.mydevices({}, function(data){
      managerDevices = _.where(data.devices, {type: 'nodered-docker-manager'});
      devices = _.pluck(managerDevices, 'uuid');
      var msg = {
        devices: devices,
        topic: topic,
        qos: 0
      };
      debug('sendMessage.token', flow.token);
      msg.payload = {
        uuid: flow.flowId,
        token: flow.token,
        flow: self.convertFlow(flow)
      };
      meshblu.message(msg);
    });
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
    return self.resetMeshbluFlowToken(flow).then(function(token){
      flow.token = token;
      return self.saveMeshbluFlow(flow);
    });
  };

  self.resetMeshbluFlowToken = function(flow) {
    return when.promise(function(resolve, reject){

      var protocol = (config.skynet.port == 443) ? 'https' : 'http';
      var uri = url.format({
        protocol: protocol,
        hostname: config.skynet.host,
        port: config.skynet.port,
        pathname: '/devices/' + flow.flowId + '/token'
      });

      var options = {
        json: {},
        headers: { skynet_auth_uuid: userUUID, skynet_auth_token: userToken }
      };

      request.post(uri, options, function(error, response, body){
        debug('resetToken resolved', error, body);
        if(error) { return reject(error); }
        resolve(body.token);
      });
    });
  };


  self.saveMeshbluFlow = function(flow) {
    return when.promise(function(resolve, reject){

      var protocol = (config.skynet.port == 443) ? 'https' : 'http';
      var uri = url.format({
        protocol: protocol,
        hostname: config.skynet.host,
        port: config.skynet.port,
        pathname: '/devices/' + flow.flowId
      });

      var options = {
        json:    { uuid: flow.flowId, name: flow.name, token: flow.token, flow: self.convertFlow(flow), online: false },
        headers: { skynet_auth_uuid: flow.flowId, skynet_auth_token: flow.token }
      };

      request.put(uri, options, function(error, response, body){
        debug('update resolved', error, body);
        if(error) { return reject(error); }
        resolve(body);
      });
    });
  };
};

FlowDeploy.start = function(userUUID, userToken, flow, meshblu){
  var flowDeploy, mergedFlow, flowDevice, user, deviceCollection;

  flowDeploy = new FlowDeploy({userUUID: userUUID, userToken: userToken, meshblu: meshblu});
  return flowDeploy.getUser().then(function(theUser){
    user = theUser;
    return Channel.findAll();
  }).then(function(channels){
    mergedFlow = flowDeploy.mergeFlowTokens(flow, user.api, channels);
    flowDeploy.startFlow(mergedFlow);
  }, function(error){
    console.error(error);
    throw new Error(error);
  });
};

FlowDeploy.stop = function(userUUID, userToken, flow, meshblu){
  var flowDeploy, flowDevice;

  flowDeploy = new FlowDeploy({userUUID: userUUID, userToken: userToken, meshblu: meshblu});
  return when.promise(function(resolve,reject){
    flowDeploy.stopFlow(flow);
    return resolve();
  });
};

module.exports = FlowDeploy;
