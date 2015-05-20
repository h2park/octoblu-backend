var _ = require('lodash');

var NodeController = function(options){
  var self, NodeController, addResourceType,
  self = this,
  NodeCollection = require('../collections/node-collection');

  self.index = function(req, res){
    var uuid = req.uuid;
    var token = req.token;
    var collection = self.getNodeCollection(uuid, token);
    collection.fetch().then(function(nodes){
      res.status(200).send(addResourceType(nodes));
    });
  };

  self.getNodeCollection = function(uuid, token){
    return new NodeCollection(uuid, token);
  };

  addResourceType = function(items){
    return _.map(items, function(item){
      return _.extend({resourceType: 'node'}, item);
    });
  }
};

module.exports = NodeController;
