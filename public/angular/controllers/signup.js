'use strict';

angular.module('octobluApp')
.controller('SignupController', function($scope, $state, $location,  AuthService) {

  var signupParams = $location.search();
  $scope.errorMsg = '';

  var comparePasswords = function(){
    if($scope.password !== $scope.password_confirmation){
      $scope.errorMsg = 'Passwords Don\'t Match';
      return false;
    }

    $scope.errorMsg = undefined;
    return true;
  };

  $scope.$watch('password', comparePasswords);
  $scope.$watch('password_confirmation', comparePasswords);

  $scope.signupUser = function(){
    if(!comparePasswords()) { return; }

    AuthService.signup(
      $scope.email,
      $scope.password,
      signupParams.testerId,
      signupParams.code
    ).then(function(){
      $state.go('ob.home');
    }, function(error){
      $scope.errorMsg = error;
    });
  };
});
