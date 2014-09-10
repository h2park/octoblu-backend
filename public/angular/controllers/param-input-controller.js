angular.module('octobluApp')
.controller('ParamInputController', function($scope) {
  'use strict';
  var compactModel, filterModel, generateDefaults, setParamDefinitions;

  compactModel = function(){
    $scope.ngModel = _.pick($scope.ngModel, function(value){
      return value !== '';
    });
  };

  filterModel = function(){
    var names = _.pluck($scope.paramDefinitions, 'name');
    $scope.ngModel = _.pick($scope.ngModel, names);
    _.defaults($scope.ngModel, generateDefaults($scope.paramDefinitions));
  };

  generateDefaults = function(paramDefinitions){
    var defaults = {};
    _.each(paramDefinitions, function(paramDefinition){
      defaults[paramDefinition.name] = paramDefinition.default;
    });
    return defaults;
  };

  setParamDefinitions = function(){
    if(!$scope.selectedEndpoint) { return; }
    var params = $scope.selectedEndpoint.params;
    $scope.paramDefinitions = _.where(params, {style: $scope.paramStyle});
  };

  $scope.$watch('selectedEndpoint', setParamDefinitions);
  $scope.$watch('paramDefinitions', filterModel);
  $scope.$watch('ngModel', compactModel, true);
});
