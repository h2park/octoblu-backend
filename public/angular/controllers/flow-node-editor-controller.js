angular.module('octobluApp')
.controller('FlowNodeEditorController', function ($scope, FlowNodeTypeService) {
  'use strict';

  var setFlowNodeType = function() {
    if(!$scope.flowNode) {
      $scope.flowNodeType = null;
      return;
    }

    FlowNodeTypeService.getFlowNodeType($scope.flowNode.type).then(function(flowNodeType){
      $scope.flowNodeType = flowNodeType;
    });
  };

  $scope.close = function(){
    $scope.flowNode = null;
  };

  setFlowNodeType();
  $scope.$watch('flowNode', setFlowNodeType);
});
