angular.module('octobluApp')
.controller('DesignerController', function ($state, $scope, FlowService) {

  FlowService.getAllFlows().then(function (flows) {
    var flow = _.first(flows);
    $state.flows = flows;
    $state.go('flow', {flowId: flow.flowId}, {location: 'replace'});
  });

  $scope.getActiveFlow = function () {
    return FlowService.getActiveFlow();
  };

  $scope.setActiveFlow = function (flow) {
    $scope.activeFlow = flow;
    FlowService.setActiveFlow($scope.activeFlow);
  };

  $scope.isActiveFlow = function (flow) {
    return flow === $scope.activeFlow;
  };

  $scope.addFlow = function () {
    return FlowService.createFlow().then(function () {
      $state.go('flow', {flowId: newFlow.flowId});
    });
  };

  $scope.deleteFlow = function (flow) {
    var deleteFlowConfirmed = $window.confirm('Are you sure you want to delete ' + flow.name + '?');
    if (deleteFlowConfirmed) {
      FlowService.deleteFlow(flow.flowId).then(function () {
        $state.go('design', {}, {reload: true});
      });
    }
  };
});
