var NodeCollection = require('./node-collection');
var when = require('when');
var _ = require('lodash');
var fs = require('fs');

var operations = JSON.parse(fs.readFileSync('assets/json/operations.json'));

var FlowNodeTypeCollection = function(userUUID, userToken, options){
  var self;
  self = this;

  options  = options || {};

  self.convertNode = function(node){
    return {
      name: node.name,
      class: _.kebabCase(node.type),
      type: node.type,
      logo: (node.nodeType && node.nodeType.logo),
      category: node.category,
      uuid: node.uuid,
      defaults: node,
      input: 1,
      output: 1,
      helpText: (node.nodeType && node.nodeType.helpText),
      formTemplatePath: "/pages/node_forms/" + node.category + "_form.html"
    };
  };

  self.fetch = function(){
    return when.all([self.fromNodes(), self.fromFile()]).then(function(responseArrays){
      return _.flatten(responseArrays, true);
    });
  };

  self.fromFile = function(){
    var promise = when.promise(function(resolve){
      resolve(operations);
    });

    return promise;
  };

  self.fromNodes = function(){
    var nodeCollection = self.getNodeCollection();

    return nodeCollection.fetch().then(function(nodes){
      return _.map(nodes, self.convertNode);
    });
  };

  self.getNodeCollection = function(){
    return new NodeCollection(userUUID, userToken);
  };

  return self;
};

module.exports = FlowNodeTypeCollection;
