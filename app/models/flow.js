'use strict';
var octobluDB = require('../lib/database');
var _         = require('lodash');
var when      = require('when');
var request   = require('request');
var MeshbluHttp = require('meshblu-http');

function FlowModel() {
  var collection = octobluDB.getCollection('flows');

  var methods = {
    createByUserUUID : function (userUUID, flowData, meshbluJSON) {
      var self = this;
      return registerFlow(meshbluJSON, userUUID).then(function (device) {
        var data = mergeFlowData(userUUID, flowData, device);
        return self.insert(data).then(function () {
          return data;
        });
      });
    },

    deleteByFlowIdAndUser : function (flowId, userUUID, userToken, meshbluJSON) {
      var query, self;
      var FlowDeploy = require('./flow-deploy');
      self = this;
      query = {flowId: flowId};

      return self.findOne(query).then(function (flow) {
        FlowDeploy.stop(userUUID, userToken, flow, meshbluJSON);
        return unregisterFlow(meshbluJSON, flow.flowId, userUUID, userToken).then(function () {
          return self.remove(query, true);
        });
      });
    },

    updateByFlowIdAndUser : function (flowId, userUUID, flowData, meshbluJSON) {
      var updatedFlow;
      var self = this;
      var query = {flowId: flowId, 'resource.owner.uuid': userUUID};

      return self.findOne(query).then(function(flow) {
        if (!flow) {
          throw new Error('Flow not found', flowId);
        }
        return _.extend({}, flow, flowData);
      }).then(function(newFlow){
        updatedFlow = newFlow;
        return self.update(query, newFlow);
      }).then(function(){
        self.updateMeshbluFlow(updatedFlow, meshbluJSON);
      });
    },

    updateMeshbluFlow : function (flow, meshbluJSON){
      var self = this;
      if (!meshbluJSON){
        return when.resolve(flow);
      }
      return when.promise(function (resolve, reject) {
        var meshbluHttp = new MeshbluHttp(meshbluJSON);
        meshbluHttp.update(flow.flowId, {draft: flow}, function(error){
          if (error) {
            return reject(error);
          }
          return resolve(flow);
        });
      }).then(function(){
        return self.update({flowId: flow.flowId}, {"$set":{"drafted":true}});
      }).then(function(){
        return flow;
      });
    },

    getFlows : function (userUUID, meshbluJSON) {
      var self = this;
      var allFlows;
      return self.find({'resource.owner.uuid': userUUID}).then(function(flows){
        allFlows = flows;
        return when.map(flows, function(flow) { self.migrateFlow(flow, meshbluJSON) });
      }).then(function(){
        return allFlows;
      });
    },

    someFlows : function (userUUID, limit, callback) {
      var self = this;
      self.originalFind({'resource.owner.uuid': userUUID}).sort({_id: -1})
      .limit(parseInt(limit), function(err, flows){
        if(err){
          callback(err);
        }
        callback(flows);
      });
    },

    getFlowWithOwner : function(flowId, userUUID, meshbluJSON) {
      var self = this;
      return self.findOne({'flowId': flowId, 'resource.owner.uuid': userUUID}).then(function(flow){
        return self.migrateAndUseDraft(flow, meshbluJSON);
      });
    },

    migrateFlow : function(flow, meshbluJSON) {
      var self = this;
      if (flow.drafted) {
        return when.resolve(flow);
      }
      return self.updateMeshbluFlow(flow, meshbluJSON);
    },

    migrateAndUseDraft : function(flow, meshbluJSON) {
      var self = this;

      return self.migrateFlow(flow, meshbluJSON).then(function(flow){
        var meshbluHttp = new MeshbluHttp(meshbluJSON);
        return when.promise(function (resolve, reject) {
          meshbluHttp.device(flow.flowId, function(error, device){
            if (error) {
              return reject(error);
            }

            if (device && device.draft) {
              return resolve(device.draft);
            }

            return resolve(flow);
          });
        });
      });
    },

    getFlow : function (flowId, meshbluJSON) {
      var self = this;
      return self.findOne({'flowId': flowId}).then(function(flow){
        return self.migrateAndUseDraft(flow, meshbluJSON);
      });
    }
  };

  return _.extend({}, collection, methods);
}

var registerFlow = function (meshbluJSON, userUUID) {
  var device = {
    owner: userUUID,
    type: 'octoblu:flow',
    sendWhitelist: [userUUID],
    receiveWhitelist: [userUUID],
    configureWhitelist: [userUUID]
  }
  var meshbluHttp = new MeshbluHttp(meshbluJSON);

  return when.promise(function (resolve, reject) {
    meshbluHttp.register(device, function (error, data) {
      if (error) {
        return reject(error);
      }
      resolve(data);
    });
  });
};

var unregisterFlow = function (meshbluJSON, flowId, uuid, token) {
  var self = this, uri, params;
  var config = _.extend({}, meshbluJSON, {uuid: uuid, token: token});

  var meshbluHttp = new MeshbluHttp(config);

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
