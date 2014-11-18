angular.module('octobluApp')
.service('NodeTypeService', function ($http, $q) {
  'use strict';

  var self = this;

  self.getNodeTypes = function(){
    return $http.get('/api/node_types', {cache:true}).then(function(res){
      var nodeTypes = _.filter(res.data, function(data){
        return data.enabled;
      });

      return _.map(nodeTypes, self.addLogo);
    });
  };

  self.addLogo = function(node){
    var nodeCopy = _.clone(node);
    nodeCopy.logo = 'https://ds78apnml6was.cloudfront.net/' + nodeCopy.type.replace(':', '/') + '.svg';
    return nodeCopy;
  };

  self.getNodeTypeById = function(id){
    return self.getNodeTypes().then(function(nodeTypes){
      return _.findWhere(nodeTypes, {_id: id});
    });
  };

  self.getNodeTypeByType = function(type){
    return self.getNodeTypes().then(function(nodeTypes){
      return _.findWhere(nodeTypes, {type: type});
    });
  };

  self.getById = self.getNodeTypeById;

  return self;
});

