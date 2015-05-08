var _ = require('lodash');
var when = require('when');
var FlowNodeTypeCollection = require('../collections/flow-node-type-collection');
var TemplateController = function (options, dependencies) {
  var self = this;
  dependencies = dependencies || {};
  var Template  = dependencies.Template || require('../models/template-model');
  var TemplateTransformer = dependencies.TemplateTransformer || require('../transformers/template-transformer');
  templateTransformer = new TemplateTransformer();

  templateModel = new Template();
  var meshblu = options.meshblu;

  self.addOwnerName = function(req, res, next) {
      templateTransformer.addOwnerName(req.template)
        .then(function(template){
          req.template = template;
          next();
        });
  };

  self.addOwnerNames = function(req, res, next) {
      templateTransformer.addOwnerNames(req.templates)
        .then(function(templates){
          req.templates = templates;
          next();
        });
  };

  self.findByPublic = function(req, res, next) {
    return templateModel.findByPublic(req.query.tags)
      .then(function(templates) {
        req.templates = templates;
        next();
      });
  };

  self.create = function(req, res, next) {
    return templateModel.createByUserUUID(req.user.resource.uuid, req.body)
      .then(function(template){
        req.template = template;
        next();
      });
  };

  self.createRaw = function(req, res, next) {
    return templateModel.createRawByUserUUID(req.user.resource.uuid, req.body)
      .then(function(template){
        req.template = template;
        next();
      });
  };

  self.update = function(req, res, next) {
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

  self.findOne = function(req, res, next) {
    var query = {
      uuid: req.params.id
    };
    return templateModel.findOne(query)
      .then(function(template) {
        req.template = template;
        next();
      });
  };

  self.withUserUUID = function(req, res, next) {
    return templateModel.withUserUUID(req.params.uuid)
      .then(function(templates) {
        req.templates = templates;
        next();
      });
  };

  self.getAllTemplates = function(req, res, next) {
    return templateModel.withUserUUID(req.user.resource.uuid)
      .then(function(templates) {
        var sortedTemplates = _.sortBy(templates, 'created').reverse()
        req.templates = sortedTemplates;
        next();
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

  self.withFlowId = function(req, res, next) {
    templateModel.withFlowId(req.params.flowId)
      .then(function(templates) {
        req.templates = templates;
        next();
    });
  }

  self.getFlowNodeTypes = function(uuid, token){
    var flowNodeTypeCollection = new FlowNodeTypeCollection(uuid, token);
    return flowNodeTypeCollection.fetch()
      .then(function (flowNodeTypes) {
        return flowNodeTypes;
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
