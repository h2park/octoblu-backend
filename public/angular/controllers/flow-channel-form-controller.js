angular.module('octobluApp')
.controller('FlowChannelFormController', function($scope, channelService) {
  'use strict';

  var getResources = function(){
    if(!$scope.node.channelid){
      return $scope.resources = null;
    }

    channelService.getById($scope.node.channelid).then(function(channel){
      $scope.resources = channel.application.resources;
    });
  }

  $scope.getEndpointLabel = function(resource) {
    return resource.httpMethod + ' ' + resource.path;
  }

  var selectEndpoint = function(){
    var node, resources, selectedEndpoint;

    node = $scope.node;
    resources = $scope.resources
    selectedEndpoint = _.findWhere(resources, {path: node.path, httpMethod: node.method});
    $scope.selectedEndpoint = selectedEndpoint || _.first(resources);
  };

  $scope.$watch('selectedEndpoint', function(){
    if(!$scope.selectedEndpoint){
      return;
    }
    $scope.node.path   = $scope.selectedEndpoint.path;
    $scope.node.endpoint = $scope.selectedEndpoint.fullURL;
    $scope.node.method = $scope.selectedEndpoint.httpMethod;
  });

  $scope.$watch('node',        getResources);
  $scope.$watch('node.path',   selectEndpoint);
  $scope.$watch('node.method', selectEndpoint);
  $scope.$watch('resources',   selectEndpoint);
});
