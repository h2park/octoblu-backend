'use strict';

angular.module('octobluApp')
.controller('ProcessController', function ($scope, ProcessNodeService) {

  ProcessNodeService.getProcessNodes().then(function(processNodes){
    $scope.processNodes = processNodes;
  });

  $scope.stopProcess = function(processNode){
    ProcessNodeService.stopProcess(processNode);
  };

  $scope.startProcess = function(processNode){
    ProcessNodeService.startProcess(processNode);
  };
});