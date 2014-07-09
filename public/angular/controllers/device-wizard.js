angular.module('octobluApp')
    .controller('DeviceWizardController', function ($scope, $state,currentUser, availableDeviceTypes,  unclaimedDevices, deviceService) {




        $scope.getStateName = function () {
            return $state.current.name;
        };

        if($state.params.claim === 'gateway'){
            $scope.gateway=true;
        } else {
            $scope.gateway=false;
        }

        $scope.model = {
            deviceTypes : availableDeviceTypes,
            unclaimedDevices : _.filter(unclaimedDevices, function(device){
                //If we are selecting gateways, we only filter for gateways otherwise select all other devices.
                if($state.params.claim === 'gateway'){
                    return device.type === 'gateway';
                } else {
                    return device.type !== 'gateway';
                }
            }),
            claim : $state.params.claim
        };
        $scope.isopen = false;
        $scope.user = currentUser;
        $scope.claimDevice = function () {
            deviceService
                .claimDevice($scope.model.device.uuid)
                .then(function (result) {
                    //now update the name
                    return deviceService.updateDevice($scope.model.device.uuid, { name: $scope.model.name });
                }).then(function (device) {
                    console.log(device);
                    angular.extend($scope.model.device, device);
                    $state.go('ob.connector.devices.all');
                }, function (error) {
                    console.log(error);
                    $state.go('ob.connector.devices.all');
                });
        };

        $scope.toggleOpen = function () {
            $scope.isopen = !$scope.isopen;
        };
    });