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
      })
      .catch(function(error){
        res.send(422, error);
      });
  };

  self.create = function(req, res, next) {
    return templateModel.createByUserUUID(req.user.resource.uuid, req.body)
      .then(function(template){
        req.template = template;
        next();
      })
      .catch(function(error){
        res.send(422, error);
      });
  };

  self.createRaw = function(req, res, next) {
    return templateModel.createRawByUserUUID(req.user.resource.uuid, req.body)
      .then(function(template){
        req.template = template;
        next();
      })
      .catch(function(error){
        res.send(422, error);
      });
  };

  self.update = function(req, res, next) {
    var query = {uuid: req.params.id};
    templateModel.findOne(req.uuid, query)
      .then(function(template){
        var updatedTemplate = _.extend({}, template, req.body);
        return templateModel.update(req.uuid, query, updatedTemplate);
      })
      .then(function(){
        next();
      })
      .catch(function(error) {
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
      })
      .catch(function(error){
        res.send(422, error);
      });
  };

  self.withUserUUID = function(req, res, next) {
    return templateModel.withUserUUID(req.params.uuid)
      .then(function(templates) {
        req.templates = templates;
        next();
      })
      .catch(function(error){
        res.send(422, error);
      });
  };

  self.getAllTemplates = function(req, res, next) {
    return templateModel.withUserUUID(req.user.resource.uuid)
      .then(function(templates) {
        var sortedTemplates = _.sortBy(templates, 'created').reverse()
        req.templates = sortedTemplates;
        next();
      })
      .catch(function(error){
        res.send(422, error);
      });
  };

  self.importTemplate = function(req, res) {
    self.getFlowNodeTypes(req.uuid, req.token)
      .then(function (flowNodeTypes) {
        return templateModel.importTemplate(req.user.resource.uuid, req.params.id, meshblu, flowNodeTypes);
      })
      .then(function(flow){
        res.send(201, flow);
      })
      .catch(function(error){
        res.send(422, error);
      });
  };

  self.withFlowId = function(req, res, next) {
    templateModel.withFlowId(req.params.flowId)
      .then(function(templates) {
        req.templates = templates;
        next();
      })
      .catch(function(error){
        res.send(422, error);
      });
  }

  self.getFlowNodeTypes = function(uuid, token){
    var flowNodeTypeCollection = new FlowNodeTypeCollection(uuid, token);
    return flowNodeTypeCollection.fetch()
      .then(function (flowNodeTypes) {
        return flowNodeTypes;
      });
  }

  self.delete = function(req, res, next) {
    templateModel.remove({uuid: req.params.id})
      .then(function() {
        next();
      })
      .then(function(error) {
        res.send(422, error);
      });
  }

  self.send = function(req, res) {
    if(req.templates)
      return res.send(200, req.templates);

    if(req.template)
      return res.send(200, req.templates);

    if(req.templateId)
      return res.send(200, req.templateId);

    return res.send(204);
  };

};

module.exports = TemplateController;
