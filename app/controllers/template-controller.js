var _ = require('lodash');
var when = require('when');
var FlowNodeTypeCollection = require('../collections/flow-node-type-collection');

var TemplateController = function (options, dependencies) {
  var self = this;
  dependencies = dependencies || {};
  var Template  = dependencies.Template || require('../models/template-model');
  templateModel = new Template();
  var meshblu = options.meshblu;

  self.findByPublic = function(req, res) {
    return templateModel.findByPublic(req.query.tags).then(function(templates){
      res.send(200, templates);
    }, function(error) {
      res.send(422, error);
      return when.reject(error);
    });
  };

  self.create = function(req, res) {
    templateModel.createByUserUUID(req.user.resource.uuid, req.body).then(function(template){
      res.send(201, template);
    }, function(error) {
      res.send(422, error);
    });
  };

  self.createRaw = function(req, res) {
    templateModel.createRawByUserUUID(req.user.resource.uuid, req.body).then(function(template){
      res.send(201, template);
    }, function(error) {
      res.send(422, error);
    });
  };

  self.update = function(req, res) {
    var query = {uuid: req.params.id};
    templateModel.findOne(req.uuid, query).then(function(template){
      var updatedTemplate = _.extend({}, template, req.body);
      return templateModel.update(req.uuid, query, updatedTemplate);
    }).then(function(){
      res.send(204);
    }, function(error) {
      res.send(422, error);
    });
  };

  self.findOne = function(req, res) {
    var query = {
      uuid: req.params.id
    };
    return templateModel.findOne(query).then(function(template) {
      res.send(200, template);
    }, function(error) {
      res.send(404, error);
    });
  };

  self.withUserUUID = function(req, res) {
    return templateModel.withUserUUID(req.params.uuid).then(function(templates) {
      res.send(200, templates);
    }, function(error) {
      res.send(404, error);
    });
  };

  self.getAllTemplates = function(req, res) {
    return templateModel.withUserUUID(req.user.resource.uuid).then(function(templates) {
      var sortedTemplates = _.sortBy(templates, 'created').reverse()
      res.send(200, sortedTemplates);
    }, function(error) {
      res.send(404, error);
    });
  };

  self.importTemplate = function(req, res) {
    var uuid = req.uuid;
    var token = req.token;
    self.getFlowNodeTypes(uuid, token).then(function (flowNodeTypes) {
      templateModel.importTemplate(req.user.resource.uuid, req.params.id, meshblu, flowNodeTypes).then(function(flow){
        res.send(201, flow);
      }, function(error) {
        res.send(422, error);
      });
    }, function(error){
      res.send(422, error);
    });
  };

  self.getFlowNodeTypes = function(uuid, token){
    var flowNodeTypeCollection = new FlowNodeTypeCollection(uuid, token);
    return flowNodeTypeCollection.fetch().then(function (flowNodeTypes) {
      return flowNodeTypes;
    });
  }

  self.withFlowId = function(req, res) {
    templateModel.withFlowId(req.params.flowId).then(function(templates) {
      res.send(200, templates);
    }, function(error) {
      res.send(422, error);
    });
  }

  self.delete = function(req, res) {
    templateModel.remove({uuid: req.params.id}).then(function() {
      res.send(200);
    }, function(error) {
      res.send(422, error);
    });
  }
};


module.exports = TemplateController;
