'use strict';

angular.module('octobluApp')
  .controller('addDeviceController', function ($scope, $state, $stateParams, currentUser, NodeTypeService, deviceService) {
    $scope.newDevice = {};
    $scope.existingDevice = {};

    NodeTypeService.getNodeTypeById($stateParams.nodeTypeId)
    .then(function (nodeType) {
      $scope.nodeType  = nodeType;
      return deviceService.getUnclaimed($scope.nodeType.skynet.type);
    })
    .then(function (unclaimedDevices) {
      _.each(unclaimedDevices, function(device){
        device.label = device.uuid + '(' + (device.type || 'device') + ')';
      });
      $scope.newDevice.unclaimedDevices = unclaimedDevices;
      $scope.newDevice.selectedDevice = _.first(unclaimedDevices);
      $scope.newDevice.unclaimedDevices.unshift({type: 'existing', label: 'Claim Existing'});
    });

    $scope.addDevice = function () {
      var deviceOptions, promise;
      delete $scope.errorMessage;

      deviceOptions = {
        type: $scope.nodeType.skynet.type,
        subtype: $scope.nodeType.skynet.subtype,
        name: $scope.newDevice.name
      };

      if($scope.nodeType.skynet.subtype) {
        deviceOptions.type += ':' + $scope.nodeType.skynet.subtype;
      }

      if ($scope.newDevice.selectedDevice) {
        if ($scope.newDevice.selectedDevice.type === 'existing') {
          deviceOptions.uuid = $scope.existingDevice.uuid;
          deviceOptions.token = $scope.existingDevice.token;
          deviceOptions.owner = currentUser.skynet.uuid;
          deviceOptions.isChanged = true;
          promise = deviceService.updateDevice(deviceOptions);
        } else {
          deviceOptions.uuid = $scope.newDevice.selectedDevice.uuid;
          promise = deviceService.claimDevice(deviceOptions);
        }
      } else {
        promise = deviceService.registerDevice(deviceOptions);
      }

      promise.then(function () {
        $state.go("ob.connector.nodes.all");
      }, function (error) {
        $scope.errorMessage = error;
      });

    };
  });
