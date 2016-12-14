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
  var meshblu = options.meshbluJSON;

  self.addOwnerName = function(req, res, next) {
      templateTransformer.addOwnerName(req.template)
        .then(function(template){
          req.template = template;
          next();
        })
        .catch(function(error){
          res.sendError(error);
        });
  };

  self.addOwnerNames = function(req, res, next) {
      templateTransformer.addOwnerNames(req.templates)
        .then(function(templates){
          req.templates = templates;
          next();
        })
        .catch(function(error){
          res.sendError(error);
        });
  };

  self.findByPublic = function(req, res, next) {
    req.query.pageLimit = req.query.pageLimit || 10;
    return templateModel.findByPublic(req.query.tags, parseInt(req.query.pageLimit), req.query.pageNumber, req.query.nameFilter)
      .then(function(templates) {
          req.templates = templates;
          next();
      })
      .catch(function(error){
        res.send(422, error.message);
      });
  };

  self.findRecentPublic = function(req, res, next) {
    req.query.limit = req.query.limit || 10;
    return templateModel.findRecentPublic(req.query.tags, parseInt(req.query.limit))
      .then(function(templates) {
          req.templates = templates;
          next();
      })
      .catch(function(error){
        res.send(422, error.message);
      });
  };

  self.like = function(req, res) {
    return templateModel.like(req.uuid, req.params.id)
      .then(function(){
        res.send(201);
      })
      .catch(function(error){
        res.send(422, error.message);
      });
  };

  self.unlike = function(req, res) {
    return templateModel.unlike(req.uuid, req.params.id)
      .then(function(){
        res.send(200);
      })
      .catch(function(error){
        res.send(422, error.message);
      });
  };

  self.create = function(req, res, next) {
    return templateModel.createByUserUUID(req.user.resource.uuid, req.body)
      .then(function(template){
        req.template = template;
        next();
      })
      .catch(function(error){
        res.send(422, error.message);
      });
  };

  self.createRaw = function(req, res, next) {
    return templateModel.createRawByUserUUID(req.user.resource.uuid, req.body)
      .then(function(template){
        req.template = template;
        next();
      })
      .catch(function(error){
        res.send(422, error.message);
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
        res.send(422, error.message);
      });
  };

  self.findOne = function(req, res, next) {
    var query = {
      uuid: req.params.id
    };
    return templateModel.findOne(req.uuid, query)
      .then(function(template) {
        req.template = template;
        next();
      })
      .catch(function(error){
        res.send(422, error.message);
      });
  };

  self.withUserUUID = function(req, res, next) {
    return templateModel.withUserUUID(req.params.uuid)
      .then(function(templates) {
        req.templates = templates;
        next();
      })
      .catch(function(error){
        res.send(422, error.message);
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
        res.send(422, error.message);
      });
  };

  self.importTemplate = function(req, res) {
    var skipPopulateNode = req.query.skipPopulateNode;
    self.getFlowNodeTypes(req.uuid, req.token)
      .then(function (flowNodeTypes) {
        return templateModel.importTemplate(req.user.resource.uuid, req.params.id, meshblu, flowNodeTypes, skipPopulateNode);
      })
      .then(function(flow){
        res.send(201, flow);
      })
      .catch(function(error){
        res.send(422, error.message);
      });
  };

  self.withFlowId = function(req, res, next) {
    templateModel.withFlowId(req.params.flowId)
      .then(function(templates) {
        req.templates = templates;
        next();
      })
      .catch(function(error){
        res.send(422, error.message);
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
    templateModel.remove(req.uuid, {uuid: req.params.id})
      .then(function() {
        next();
      })
      .catch(function(error) {
        res.send(422, error.message);
      });
  }

  self.send = function(req, res) {
    if(req.templates)
      return res.send(200, req.templates);

    if(req.template)
      return res.send(200, req.template);

    if(req.templateId)
      return res.send(200, req.templateId);

    return res.send(204);
  };

};

module.exports = TemplateController;
