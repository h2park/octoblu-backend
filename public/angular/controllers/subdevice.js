angular.module('octobluApp')
    .controller('AddSubDeviceController',  function ($rootScope, $scope, $modalInstance, mode, hubs, smartDevice, selectedHub,  installedHubs )
    {
        $scope.hubs = hubs;
        $scope.mode = mode;
        $scope.smartDevice = smartDevice;

        if (selectedHub){
            selectedHub = JSON.parse(selectedHub);

            $scope.selectedHub = _.findWhere(hubs, {
                'uuid' : selectedHub.uuid
            });

        } else {
            $scope.selectedHub = $scope.hubs[0];
            $scope.plugins = $scope.hubs[0].plugins;
        }

        $scope.devicePlugin = _.findWhere($scope.plugins, {name: smartDevice.plugin});
        var keys = _.keys($scope.devicePlugin.optionsSchema.properties);

        var deviceProperties = _.map(keys, function(propertyKey){
            var propertyValue = $scope.devicePlugin.optionsSchema.properties[propertyKey];
            var deviceProperty = {};
            deviceProperty.name = propertyKey;
            deviceProperty.type = propertyValue.type;
            deviceProperty.required = propertyValue.required;
            deviceProperty.value = "";
            return deviceProperty;
        });
        $scope.deviceProperties = deviceProperties;


        $rootScope.skynetSocket.emit('gatewayConfig', {
            "uuid": $scope.hubs[0].uuid,
            "token": $scope.hubs[0].token,
            "method": "getDefaultOptions",
            "name": smartDevice.plugin
        }, function (defaults) {
            // TODO: defaults are not returning - factor into object
            console.log('config:', defaults);
            console.log($scope.deviceProperties);
            _.each(defaults.result, function(value, key){

                var deviceProperty = _.findWhere($scope.deviceProperties, {
                    'name' : key
                } );

                if( deviceProperty ) {
                    $scope.$apply(function(){
                        deviceProperty.value = value;
                    });
                }
            });
        });

        $scope.getDefaults = function(hub){

            $rootScope.skynetSocket.emit('gatewayConfig', {
                "uuid": hub.uuid,
                "token": hub.token,
                "method": "getDefaultOptions",
                "name": smartDevice.plugin
            }, function (defaults) {
                _.each(defaults.result, function(value, key){
                    var deviceProperty = _.findWhere($scope.deviceProperties, {
                        'name' : key
                    } );

                    if( deviceProperty ) {
                        $scope.$apply(function(){
                            deviceProperty.value = value;
                        });
                    }
                });
            });
        };


        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.closeAlert = function(validationError){
            $scope.validationErrors = _.without($scope.validationErrors, validationError) ;
        }

        $scope.validate = function(subDeviceName, hub, deviceProperties){
            var errors = [];
            var idIndex = 0;
            if(subDeviceName === undefined || subDeviceName.length === 0){
                errors.push(
                    {
                        type : 'danger',
                        summary : 'Device Name Required',
                        msg : 'Device Name is required. Please enter a device name.'
                    }
                )
            }
            var duplicateSubDevice = _.findWhere(hub.subdevices, {'name' : subDeviceName });

            if(duplicateSubDevice){
                errors.push({
                    type : 'danger',
                    summary : 'Duplicate sub-device name: ' + subDeviceName,
                    msg : $scope.selectedHub.name + ' already has a sub-device with name = ' + subDeviceName
                });

                var devicePropertiesWithErrors =  _.filter( deviceProperties, function(deviceProperty){
                    if(deviceProperty.required ){
                        if(deviceProperty.value === undefined || deviceProperty.value.length === 0){
                            return true;
                        }
                    }
                    return false;
                }) ;

                if(devicePropertiesWithErrors){
                    var optionsErrors =  _.map(devicePropertiesWithErrors, function(deviceProperty){
                        return {
                            type : 'danger',
                            summary : 'Device Option Required',
                            msg : deviceProperty.name + 'is required'
                        }
                    });
                    errors = errors.concat(optionsErrors);
                }
            }
            return errors;
        } ;

        $scope.addSubDevice = function(subDeviceName, selectedHub, smartDevice, deviceProperties) {
            var errors = this.validate(subDeviceName, selectedHub, deviceProperties);
            if( errors.length === 0 ){
                var deviceOptions = _.map(deviceProperties, function(deviceProperty){
                    var option = {};
                    option[deviceProperty.name] = deviceProperty.value;
                    return option;
                });

                $modalInstance.close(
                    {
                        name : subDeviceName,
                        hub : selectedHub,
                        device : smartDevice,
                        options : deviceOptions
                    });
            } else{
                $scope.validationErrors = errors;
            }
        }

    })
    .controller('EditSubDeviceController',  function ($rootScope, $scope, $modalInstance, mode, hub, subdevice, plugins, smartDevices )
    {
        $scope.mode = mode;
        $scope.subdevice = subdevice;

        $scope.hub = hub;

        $scope.plugins = plugins;

        $scope.smartDevices = smartDevices ;

        $scope.devicePlugin = _.findWhere($scope.plugins, {name: subdevice.type});

        $scope.deviceOptions = subdevice.options;

        var keys = _.keys($scope.devicePlugin.optionsSchema.properties);

        var deviceProperties = _.map(keys, function(propertyKey){
            var propertyValue = $scope.devicePlugin.optionsSchema.properties[propertyKey];
            var deviceProperty = {};
            deviceProperty.name = propertyKey;
            deviceProperty.type = propertyValue.type;
            deviceProperty.required = propertyValue.required;
            deviceProperty.value = subdevice.options[propertyKey];
            return deviceProperty;
        });
        $scope.deviceProperties = deviceProperties;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.ok = function(deviceProperties){

            var deviceOptions = _.map(deviceProperties, function(deviceProperty){
                var option = {};
                option[deviceProperty.name] = deviceProperty.value;
                return option;
            });

            $modalInstance.close(deviceOptions);
        }
    });
