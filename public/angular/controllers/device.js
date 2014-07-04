angular.module('octobluApp')
    .controller('DeviceController', function (skynetService, $scope, $q, $log, $state, $http, $modal, $timeout, currentUser, myDevices, myGateways, availableDeviceTypes, deviceService) {

        $scope.user = currentUser;

        $scope.subdeviceTypes = _.filter(availableDeviceTypes, function (device) {
            return device.skynet.plugin;
        });
        $scope.deviceTypes = _.difference(availableDeviceTypes, $scope.subdeviceTypes);

        $scope.devices = myDevices;
        $scope.hasHubs = myGateways.length;

        $scope.deleteDevice = function (device) {
            $scope.confirmModal($modal, $scope, $log, 'Delete Device ' + device.name, 'Are you sure you want to delete this Device?',
                function () {
                    deviceService.deleteDevice(device.uuid)
                        .then(function (device) {
                            if (device) {
                                $scope.devices = _.without($scope.devices, _.findWhere($scope.devices, {uuid: device.uuid}));
                            }
                        }, function (error) {
                        });
                },
                function () {
                    $log.info('cancel clicked');
                });

        };

        $scope.addSubdevice = function (smartDevice) {
            if (smartDevice.enabled) {
                var subdeviceModal = $modal.open({
                    templateUrl: 'pages/connector/devices/subdevice/add-edit.html',
                    controller: 'AddEditSubDeviceController',
                    backdrop: true,
                    resolve: {
                        selectedHub: function () {
                            return null;
                        },
                        pluginName: function () {
                            return smartDevice.plugin;
                        },
                        subdevice: function () {
                            return null;
                        },
                        hubs: function () {
                            return myGateways;
                        },
                        availableDeviceTypes: function () {
                            return availableDeviceTypes;
                        }
                    }
                });

                subdeviceModal.result.then(function (result) {
                    skynetService.createSubdevice({
                        uuid: result.hub.uuid,
                        token: result.hub.token,
                        type: smartDevice.plugin,
                        name: result.subdevice.name,
                        options: result.subdevice.options
                    }).then(function (response) {
                        result.hub.subdevices.push(response.result);
                    });

                }, function () {
                    console.log('cancelled');
                });
            }
        };

        $scope.addDevice = function (deviceType) {
            if (deviceType.enabled) {
                var deviceModal = $modal.open({
                    templateUrl: 'pages/connector/devices/device/add-edit.html',
                    controller: 'AddEditDeviceController',
                    backdrop: true,
                    resolve: {
                        device: function () {
                            return null;
                        },
                        owner : function(){
                           return currentUser;
                        },
                        deviceType: function () {
                            return deviceType;
                        },
                        availableDeviceTypes: function () {
                            return availableDeviceTypes;
                        }
                    }
                });

                deviceModal.result.then(function (result) {
                    skynetService.registerDevice(result.device).then(function(res){
                        $scope.devices.push(res);
                    }, function(error){
                        console.log(error); 
                    });
                }, function () {
                    console.log('cancelled');
                });
            }
        };

        $scope.editDevice = function(device){

            var deviceType = _.findWhere(availableDeviceTypes, {'skynet.type' : device.type, 'skynet.subtype' : device.subtype })
                            || _.findWhere(availableDeviceTypes, {'skynet.subtype' : 'other'});

            var deviceModal = $modal.open({
                templateUrl: 'pages/connector/devices/device/add-edit.html',
                controller: 'AddEditDeviceController',
                backdrop: true,
                resolve: {
                    device: function () {
                        return device;
                    },
                    owner : function(){
                       return currentUser;
                    },
                    deviceType: function () {
                        return deviceType;
                    },
                    availableDeviceTypes: function () {
                        return availableDeviceTypes;
                    }
                }
            });

            deviceModal.result.then(function (result) {
                skynetService.updateDevice(result.device)
                    .then(function(res){

                    });
            }, function () {
                console.log('cancelled');
            });
        };
    })
    .controller('AddEditDeviceController', function ($scope, $modalInstance, owner, device, deviceType, availableDeviceTypes) {
        $scope.model = {
            isNew: !!device,
            device: angular.copy(device) || {},
            deviceType: deviceType,
            deviceTypes: availableDeviceTypes,
            propertyEditor: {}
        };

        $scope.model.device.owner = $scope.model.device.owner || owner.skynetuuid;
        $scope.cancel = function () {
            $modalInstance.dismiss();
        };

        $scope.save = function () {
            //If the deviceType selected has an options schema then we should validate the
            //options set for errors
            if ($scope.model.deviceType.optionsSchema) {
                var errors = $scope.model.schemaEditor.validate();
                if (!errors.length) {
                    $modalInstance.close({deviceType: $scope.model.deviceType, device: $scope.model.device, isNew: $scope.model.isNew});
                }
            } else {
                $scope.model.device = angular.extend($scope.model.device, $scope.model.propertyEditor.getProperties(),
                    { type: $scope.model.deviceType.skynet.type, subtype: $scope.model.deviceType.skynet.subtype});
                $modalInstance.close({ device: $scope.model.device, isNew: $scope.model.isNew});
            }
        };
    });
