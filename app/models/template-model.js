'use strict';
var _          = require('lodash');
var when       = require('when');
var uuid       = require('node-uuid');
var debug      = require('debug')('octoblu:template-model');

function TemplateModel(dependencies) {
  dependencies                = dependencies || {};
  var User                    = require('./user');
  var octobluDB               = dependencies.Database || require('../lib/database');
  var Flow                    = dependencies.Flow || require('./flow');
  var TemplateCollection      = dependencies.TemplateCollection || require('../collections/template-collection');

  var methods = {
    createRawByUserUUID : function(userUUID, template) {
      debug('createRawByUserUUID called with', template);
      if(!template.flow) {
        debug('aaron will be wrong if it gets here');
        return when.reject(new Error('No flow data'))
      }
      var self = this;
      var templateCollection = new TemplateCollection({owner: userUUID});
      template.flow = self.cleanFlow(template.flow);
      template.tags = template.tags || self.getTags(template.flow);

      return templateCollection.create(template)
        .then(function(templateId){
          debug('templateId', templateId);
          return templateCollection.get({uuid: templateId});
        });
    },

    createByUserUUID : function(userUUID, template) {
      debug('entering createByUserUUID');
      var self = this;
      var templateCollection = new TemplateCollection({owner: userUUID});
      return Flow.findOne({flowId: template.flowId})
        .then(function(flow){
          debug('found flow', flow);
          template.flow = self.cleanFlow(flow);
          return self.createRawByUserUUID(userUUID, template);
        });
    },

    importTemplate : function(userUUID, templateId, meshblu, flowNodeTypes) {
      var self = this;
      var templateCollection = new TemplateCollection({owner: userUUID});
      return templateCollection.get({uuid: templateId})
        .then(function(template) {
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
      var stuffToKeep = ['type', 'category', 'name', 'channelid', 'useStaticMessage', 'staticMessage', 'connector', 'logo'];
      _.each(_.keys(node.defaults), function(key){
        if (_.contains(stuffToKeep, key)){
          return ;
        }
        delete node.defaults[key];
        delete node[key];
      });
      return node;
    },

    cleanId : function(node, links) {
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
      var templateCollection = new TemplateCollection()
      var query = {
        flowId: flowId
      };
      return templateCollection.list(query);
    },

    withUserUUID : function(uuid) {
      var self = this;
      var templateCollection = new TemplateCollection({owner: uuid});
      return templateCollection.list();
    },

    getTags: function(template) {
      var tags = _.pluck(template.nodes, 'type');
      tags = _.map(tags, function(tag){
        tag = tag.split(":")
        return tag[1];
      })
      debug('got tags', tags);
      return _.uniq(tags);
    },

    findByPublic: function(tags) {
      debug("Finding template with tags ", tags);
      var templateCollection = new TemplateCollection();
      var query = {};
      if(tags) {
        if( ! _.isArray(tags)){
          tags = [tags]
        }
        query = {tags: {$all: tags}};
      }
      return templateCollection.list(query);
    },
    //URGENT: functions to remove:
    findOne: function(owner, query) {
      var templateCollection = new TemplateCollection({owner: owner});
      return templateCollection.get(query);
    },

    update: function(owner, query, template) {
      var templateCollection = new TemplateCollection({owner: owner});
      return templateCollection.update(query, template);
    },

    remove: function(owner, query) {
      var templateCollection = new TemplateCollection({owner: owner});
      return templateCollection.delete(query);
    }
  };

  return methods;
}

module.exports = TemplateModel
