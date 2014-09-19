angular.module('octobluApp')
.directive('flowBrowser', function () {

  return {
    restrict: 'E',
    templateUrl: '/pages/flow-browser.html',
    replace: true,
    scope: {
      flowNodeTypes : '=',
      nodeTypes : '=',
      flow: '=',
      debugLines: '='
    },
    controller: function ($scope, FlowNodeTypeService) {
      var tabs = {
        debug: {
          name: 'debug',
          template: '/pages/flow-browser-debug.html',
          controlsTemplate: '/pages/flow-browser-debug-controls.html'
        },
        operators : {
          name: 'operators',
          template: '/pages/flow-browser-operators.html',
          controlsTemplate: '/pages/flow-browser-operators-controls.html'
        },
        nodes: {
          name: 'nodes',
          template: '/pages/flow-browser-nodes.html',
          controlsTemplate: '/pages/flow-browser-nodes-controls.html'
        },
        unconfigurednodes: {
          name: 'unconfigurednodes',
          template: '/pages/flow-browser-unconfigured-nodes.html',
          controlsTemplate: '/pages/flow-browser-nodes-controls.html'
        }
      };

      $scope.toggleActiveTab = function(name) {
        if ($scope.activeTab.name === name) {
          $scope.minimize();
        } else {
          $scope.maximize();
          $scope.setActiveTab(name);
        }
      };

      $scope.addFlowNodeType = function(flowNodeType) {
        $scope.$emit('flow-node-type-selected', flowNodeType);
      };

      $scope.maximize = function() {
        $scope.maximized = true;
      };

      $scope.minimize = function() {
        $scope.maximized = false;
      };

      $scope.clearActiveTab = function() {
        $scope.activeTab = {};
      };

      $scope.setActiveTab = function(name) {
        $scope.activeTab = tabs[name];
      };

      $scope.hasActiveTab = function() {
        return !_.isEmpty($scope.activeTab);
      }

      $scope.toggleMaximize = function() {
        $scope.maximized = !$scope.maximized;
      };

      $scope.toggleDrawer = function(){
        $scope.toggleMaximize();
        if (!$scope.hasActiveTab()) {
          $scope.setActiveTab('debug');
        }
      };

      $scope.$watch('maximized', function(){
        _.delay(function(){
          $('.flow-browser').trigger($.Event('resize'));
        }, 300);
      });

      $scope.filterNonOperators = function(flowNodeType){
        return flowNodeType && (flowNodeType.category === 'device' || flowNodeType.category === 'channel');
      };

      $scope.filterOperators = function(flowNodeType){
        return flowNodeType && (flowNodeType.category !== 'device' && flowNodeType.category !== 'channel');
      };

      $scope.clearActiveTab();
    }
  };
});
