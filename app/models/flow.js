'use strict';
var octobluDB = require('../lib/database');
var _         = require('lodash');
var when      = require('when');
var request   = require('request');
var configAuth = require('../../config/auth');
var MeshbluHttp = require('meshblu-http');

function FlowModel() {
  var collection = octobluDB.getCollection('flows');

  var methods = {
    createByUserUUID : function (userUUID, flowData, meshblu) {
      var self = this;
      return registerFlow(meshblu, userUUID).then(function (device) {
        var data = mergeFlowData(userUUID, flowData, device);
        return self.insert(data).then(function () {
          return data;
        });
      });
    },

    deleteByFlowIdAndUser : function (flowId, userUUID, userToken, meshblu) {
      var query, self;
      var FlowDeploy = require('./flow-deploy');
      self = this;
      query = {flowId: flowId};

      return self.findOne(query).then(function (flow) {
        FlowDeploy.stop(userUUID, userToken, flow, meshblu);
        return unregisterFlow(meshblu, flow.flowId, userUUID, userToken).then(function () {
          return self.remove(query, true);
        });
      });
    },

    updateByFlowIdAndUser : function (flowId, userUUID, flowData) {
      var self = this;
      var query = {flowId: flowId, 'resource.owner.uuid': userUUID};

      return self.findOne(query).then(function(flow) {
        if (!flow) {
          throw new Error('Flow not found', flowId);
        }
        return _.extend({}, flow, flowData);
      }).then(function(newFlow){
        return self.update(query, newFlow);
      });
    },

    getFlows : function (userUUID) {
      var self = this;
      return self.find({'resource.owner.uuid': userUUID});
    },

    getFlowWithOwner : function(flowId, userUUID) {
      var self = this;
      return self.findOne({'flowId': flowId, 'resource.owner.uuid': userUUID});
    },

    getFlow : function (flowId) {
      var self = this;
      return self.findOne({'flowId': flowId});
    }
  };

  return _.extend({}, collection, methods);
}

var registerFlow = function (meshblu, userUUID) {
  return when.promise(function (resolve, reject) {
    var device = {
      owner: userUUID,
      type: 'octoblu:flow',
      sendWhitelist: [userUUID, '9b47c2f1-9d9b-11e3-a443-ab1cdce04787', 'b560b6ee-c264-4ed9-b98e-e3376ce6ce64'],
      receiveWhitelist: [userUUID, '9b47c2f1-9d9b-11e3-a443-ab1cdce04787'],
      configureWhitelist: [userUUID]
    }
    meshblu.register(device, function (data) {
      resolve(data);
    });
  });
};

var unregisterFlow = function (meshblu, flowId, uuid, token) {
  var self = this, uri, params;
  var meshbluHttp = new MeshbluHttp({
    server: configAuth.skynet.host,
    port: configAuth.skynet.port,
    uuid: uuid,
    token: token
  });

  return when.promise(function (resolve, reject) {
    meshbluHttp.unregister({uuid: flowId}, function(error){
      if(error){
        return reject(error);
      }
      return resolve({success: true});
    });
  });
};

var mergeFlowData = function (userUUID, flowData, device) {
  var data = {
    flowId: device.uuid,
    token: device.token,
    name: flowData.name || ('Flow ' + device.uuid.substr(0, 8)),
    description: flowData.description,
    resource: {
      nodeType: 'flow',
      owner: {
        uuid: userUUID,
        nodeType: 'user'
      }
    }
  };
  return _.extend({}, flowData, data);
};

module.exports = new FlowModel();
