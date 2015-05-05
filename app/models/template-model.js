'use strict';
var _          = require('lodash');
var when       = require('when');
var uuid       = require('node-uuid');
var debug      = require('debug')('octoblu:template-model');

function TemplateModel(dependencies) {
  dependencies = dependencies || {};
  var User       = require('./user');
  var octobluDB  = dependencies.Database || require('../lib/database');
  var Flow       = dependencies.Flow || require('./flow');
  var collection = octobluDB.getCollection('templates');

  var methods = {
    createRawByUserUUID : function(userUUID, data) {
      if(!data.flow) {
        return when.reject(new Error('No flow data'))
      }
      var self = this;
      var template = _.extend({
        uuid: uuid.v1(),
        created: new Date(),
        resource: {
          nodeType: 'template',
          owner: {
            uuid: userUUID,
            nodeType: 'user'
          }
        }
      }, data);

      template.flow = self.cleanFlow(data.flow);
      return self.insert(template).then(function(){
        return template;
      });
    },

    createByUserUUID : function(userUUID, data) {
      var self = this;
      var result;
      return self.getNameFromUuid(userUUID).then(function(author){
        return _.extend(
          {
            uuid: uuid.v1(),
            created: new Date(),
            resource: {
              nodeType: 'template',
              owner: {
                uuid: userUUID,
                name: author,
                nodeType: 'user'
              }
            }
          }, data);
        }).then(function(template){
            return Flow.findOne({flowId: data.flowId})
            .then(function(flow) {
              template.flow = self.cleanFlow(flow);
              template.tags = self.getTags(template.flow);
              return template;
            });
          }).then(function(template){
            result = template;
            return self.insert(template);
          }).then(function(){
            return result;
        });
    },

    importTemplate : function(userUUID, templateId, meshblu, flowNodeTypes) {
      var self = this;
      return self.findOne({uuid: templateId}).then(function(template) {
        var newFlow = _.clone(template.flow);
        newFlow.name = template.name;
        _.each(newFlow.nodes, function(node){
          self.cleanId(node, newFlow.links);
          self.populateNode(node, flowNodeTypes);
        });

        return Flow.createByUserUUID(userUUID, newFlow, meshblu);
      });
    },

    importFlow : function(userUUID, flow, meshblu, flowNodeTypes) {
      var self = this;
      var newFlow = self.cleanFlow(flow);
      _.each(newFlow.nodes, function(node){
        self.cleanId(node, newFlow.links);
        self.populateNode(node, flowNodeTypes);
      });

      return Flow.createByUserUUID(userUUID, newFlow, meshblu);
    },

    cleanFlow : function(flow) {
      var self = this;
      var newFlow = _.cloneDeep(flow);

      delete newFlow._id;
      delete newFlow.flowId;
      delete newFlow.resource;
      delete newFlow.token;

      newFlow.nodes = _.map(newFlow.nodes, self.cleanNode);

      return newFlow;
    },

    cleanNode : function(node) {
      if( node.type.indexOf('operation') === 0) {
        return node;
      }

      var self = this;
      var stuffToKeep = ['type', 'category', 'name', 'channelid', 'useStaticMessage', 'staticMessage', 'connector'];
      _.each(_.keys(node.defaults), function(key){
        if (_.contains(stuffToKeep, key)){
          return ;
        }
        delete node.defaults[key];
        delete node[key];
      });
      return node;
    },

    cleanId : function(node, links){
      var oldId = node.id;
      var newId = uuid.v1();
      var toLinks = _.filter(links, {to: oldId});
      var fromLinks = _.filter(links, {from: oldId});

      node.id = newId;

      _.each(toLinks, function(toLink){
        toLink.to = newId;
      });

      _.each(fromLinks, function(fromLink){
        fromLink.from = newId;
      });
    },

    populateNode: function(node, flowNodeTypes){
      if(node.type === 'operation:device'){
        return;
      }
      node.needsConfiguration = !_.findWhere(flowNodeTypes, {uuid: node.uuid});
      node.needsSetup         = !_.findWhere(flowNodeTypes, {type: node.type});

      if(node.needsConfiguration && !node.needsSetup){
        var matchingNode = _.findWhere(flowNodeTypes, {type: node.type});

        node.channelActivationId = matchingNode.defaults.channelActivationId;
        node.uuid                = matchingNode.defaults.uuid;
        node.token               = matchingNode.defaults.token;
        node.needsConfiguration  = false;
      }
    },

    withFlowId : function(flowId) {
      var self = this;
      var query = {
        flowId: flowId
      };
      return self.find(query);
    },

    withUserUUID : function(uuid) {
      var self = this;
      var query = {
        'resource.owner.uuid' : uuid
      };
      return self.find(query);
    },

    getTags: function(template) {
      var tags = _.map(template.nodes, 'type');
      tags = _.map(tags, function(tag){
        tag = tag.split(":")
        return tag[1];
      })
      debug('got tags', tags);
      return tags;
    },

    getNameFromUuid: function(uuid){
      return User.findBySkynetUUID(uuid).then(function(user){
        var fullName = user.userDevice.octoblu.firstName + " " + user.userDevice.octoblu.lastName;
        debug("Template created by ", fullName);
        return fullName;
      });
    },

    findByPublic: function(tags) {
      debug("Finding template with tags ", tags);
      var query = {public: true};
      if(tags) {
        if( ! _.isArray(tags)){
          tags = [tags]
        }
        query.tags = {$all: tags};
      }
      return this.find(query);
    }
  };

  return _.extend({}, collection, methods);
}

module.exports = TemplateModel
