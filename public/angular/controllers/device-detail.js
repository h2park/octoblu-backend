angular.module('octobluApp')
    .controller('DeviceDetailController', function ($modal, $log, $scope, $state, $stateParams, currentUser, myDevices, availableNodeTypes, PermissionsService, deviceService) {
        var device = _.findWhere(myDevices, { uuid: $stateParams.uuid });
        $scope.device = device;

        $scope.$on('skynet:message:' + device.uuid, function (event, message) {
        });
        PermissionsService
            .allSourcePermissions($scope.device.uuid)
            .then(function (permissions) {
                $scope.sourcePermissions = permissions;
            });
        PermissionsService
            .flatSourcePermissions($scope.device.uuid)
            .then(function (permissions) {
                $scope.sourceGroups = _.uniq(permissions, function (permission) {
                    return permission.uuid;
                });
            });

        PermissionsService
            .flatTargetPermissions($scope.device.uuid)
            .then(function (permissions) {
                $scope.targetGroups = _.uniq(permissions, function (permission) {
                    return permission.uuid;
                });
            });

        PermissionsService
            .allTargetPermissions($scope.device.uuid)
            .then(function (permissions) {
                $scope.targetPermissions = permissions;
            });

        $scope.multipleNames = function (permission) {
            return (permission.name instanceof Array);
        };

        if ($scope.device.type === 'gateway') {
            deviceService.gatewayConfig({
                uuid: $scope.device.uuid,
                token: $scope.device.token,
                method: "configurationDetails"
            }).then(function (response) {
                if (response && response.result) {
                    $scope.device.subdevices = response.result.subdevices || [];
                    $scope.device.plugins = response.result.plugins || [];
                }
            });
        }

        $scope.getDisplayName = function(resource) {
            if(resource.properties) {
                resource = resource.properties;
            }
            return resource.name || resource.displayName || resource.email || 'unknown';
        };

        $scope.deleteDevice = function (device) {
            $scope.confirmModal($modal, $scope, $log, 'Delete Device ' + device.name, 'Are you sure you want to delete this Device?',
                function () {
                    deviceService.unregisterDevice(device)
                        .then(function (devices) {
                            console.log(devices);
                            $state.go('ob.connector.nodes.all', {}, {reload : true});
                        }, function (error) {
                            console.log(error);
                        });
                },
                function () {
                    $log.info('cancel clicked');
                });

        };
        
        $scope.deleteSubdevice = function (subdevice) {
            $scope.confirmModal($modal, $scope, $log, 'Delete Subdevice', 'Are you sure you want to delete this subdevice?',
                function () {
                    deviceService.gatewayConfig({
                        "uuid": device.uuid,
                        "token": device.token,
                        "method": "deleteSubdevice",
                        "name": subdevice.name
                    }).then(function (deleteResult) {
                        device.subdevices = _.without(device.subdevices, subdevice);
                    });
                },
                function () {
                    $log.info('cancel clicked');
                });

        };

        $scope.editDevice = function (device) {
            var nodeType = _.findWhere(availableNodeTypes, function (nodeType) {
                if (device.type) {
                    if (device.subtype) {
                        return nodeType.skynet.type === device.type && nodeType.skynet.subtype === device.subtype;
                    } else {
                        return nodeType.skynet.type === device.type;
                    }
                } else {
                    return nodeType.skynet.type === 'device' && nodeType.skynet.subtype === 'other';
                }
            });

            var deviceModal = $modal.open({
                templateUrl: 'pages/connector/devices/device/add-edit.html',
                controller: 'AddEditDeviceController',
                backdrop: true,
                resolve: {
                    device: function () {
                        return device;
                    },
                    owner: function () {
                        return currentUser;
                    },
                  nodeType: function () {
                        return nodeType;
                    },
                    availableNodeTypes: function () {
                        return availableNodeTypes;
                    }
                },
                size: 'lg'
            });

            deviceModal.result.then(function (result) {
                deviceService.updateDevice(result.device)
                    .then(null, function (error) {
                        console.log(error);
                    });
            }, function () {
                console.log('cancelled');
            });
        };
        
        $scope.editSubdevice = function (subdevice) {
            var subdeviceModal = $modal.open({
                templateUrl: 'pages/connector/devices/subdevice/add-edit.html',
                controller: 'AddEditSubDeviceController',
                backdrop: true,
                resolve: {
                    hubs: function () {
                        return [device];
                    },
                    pluginName: function () {
                        return subdevice.type;
                    },
                    subdevice: function () {
                        return subdevice;
                    },
                    availableNodeTypes: function () {
                        return availableNodeTypes;
                    }
                }
            });

            subdeviceModal.result.then(function (result) {
                var hub = result.hub, updatedSubdevice = result.subdevice;
                deviceService.updateSubdevice({
                    uuid: hub.uuid,
                    token: hub.token,
                    type: subdevice.type,
                    name: updatedSubdevice.name,
                    options: updatedSubdevice.options
                }).then(function (response) {
                    console.log(response);
                });

            }, function () {
                console.log('cancelled');
            });
        };
    });