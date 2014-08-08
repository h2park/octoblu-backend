angular.module('octobluApp')
  .controller('flowController', function ($scope, FlowService, FlowNodeTypeService) {
    var originalNode;

    $scope.flowEditor = {
      selectedNode: null
    };

    FlowNodeTypeService.getFlowNodeTypes()
      .then(function (flowNodeTypes) {
        $scope.flowNodeTypes = flowNodeTypes;
      });

    $scope.flows = FlowService.getAllFlows()
      .then(function (flows) {
        $scope.flows = flows;
        $scope.activeFlow = flows[0];
      });


    FlowService.getSessionFlow()
      .then(function (sessionFlow) {
        if (sessionFlow) {
          RED.view.importFromCommunity(sessionFlow);
        }
      });

    $scope.addFlow = function () {
      var name = 'Flow ' + ($scope.flows.length + 1);
      $scope.flows.push(FlowService.newFlow(name));
    };

    $scope.isActiveFlow = function (flow) {
      return flow === $scope.activeFlow;
    };

    $scope.setActiveFlow = function (flow) {
      $scope.activeFlow = flow;
    };

    $scope.updateNodeProperties = function () {
      if (!schemaControl.validate().length) {
        originalNode.node = schemaControl.getValue();
        originalNode.name = $scope.editingNodeName;
        originalNode.dirty = true;
        originalNode.changed = true;
      }
    };

    $scope.deploy = function () {
      // RED.nodes.createCompleteNodeSet()
      FlowService.deploy();
    };

    $scope.deleteSelection = function(){
      if($scope.flowEditor.activeFlow){
        _.pull($scope.flowEditor.activeFlow.nodes, $scope.flowEditor.selectedNode);
      }

      $scope.flowEditor.selectedNode = null;
      $scope.flowEditor.selectedLink = null;
    };

    $scope.save = function () {
      FlowService.saveAllFlows($scope.flows);
    }
  });
