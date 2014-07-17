angular.module('octobluApp')
    .service('deviceService', function ($q, $http, $rootScope, skynetService, reservedProperties) {
        var myDevices = [];
        var skynetPromise = skynetService.getSkynetConnection();

        function addDevice(device) {
            myDevices.push(device);
            skynetPromise.then(function (skynetConnection) {
                skynetConnection.unsubscribe({uuid: device.uuid, token: device.token});
                skynetConnection.subscribe({uuid: device.uuid, token: device.token});
            });
        }

        skynetPromise.then(function (skynetConnection) {
            skynetConnection.on('message', function (message) {
                $rootScope.$broadcast('skynet:message:' + message.fromUuid, message);
                if (message.payload && _.has(message.payload, 'online')) {
                    var device = _.findWhere(myDevices, {uuid: message.fromUuid});
                    if (device) {
                        device.online = message.payload.online;
                    }
                }
            });
        });

        var service = {
            getDevices: function (force) {
                var defer = $q.defer();
                if (myDevices.length && !force) {
                    defer.resolve(myDevices);
                } else {
                    skynetPromise
                        .then(function (skynetConnection) {
                            skynetConnection.mydevices({}, function (result) {
                                angular.copy([], myDevices);
                                _.each(result, function (device) {
                                    addDevice(device);
                                });

                                defer.resolve(result);
                            });
                        });
                }
                return defer.promise;
            },

            registerDevice: function (options) {
                return service.initializeDevice(options)
                    .then(function (result) {
                        var device = _.extend({}, result, options);
                        return service.updateDevice(device);
                    }).then(function (device) {
                        addDevice(device);
                    });
            },

            initializeDevice: function (options) {
                var device = _.omit(options, reservedProperties),
                    defer = $q.defer();

                skynetPromise.then(function (skynetConnection) {
                    device.owner = user.skynet.uuid;

                    skynetConnection.register(device, function (result) {
                        console.log('registered device!');
                        defer.resolve(result);
                    });
                });
                return defer.promise;
            },

            claimDevice: function (options) {
                var device = _.omit(options, reservedProperties),
                    defer = $q.defer();

                skynetPromise.then(function (skynetConnection) {
                    skynetConnection.claimdevice(device, function (data) {
                        defer.resolve(data);
                        addDevice(options);
                    });
                });

                return defer.promise;
            },

            updateDevice: function (options) {
                var device = _.omit(options, reservedProperties),
                    defer = $q.defer();

                skynetPromise.then(function (skynetConnection) {
                    skynetConnection.update(device, function (result) {
                        angular.copy(result, options);
                        defer.resolve(result);
                    });
                });

                return defer.promise;
            },

            unregisterDevice: function (options) {
                var device = _.findWhere(myDevices, {uuid: options.uuid}),
                    defer = $q.defer();

                skynetPromise.then(function (skynetConnection) {
                    skynetConnection.unregister({
                        uuid: options.uuid,
                        token: options.token}, function (result) {

                        if (device) {
                            myDevices.splice(_.indexOf(myDevices, device));
                        }

                        defer.resolve(result);
                    });
                });

                return defer.promise;
            },

            getUnclaimedDevices: function () {
                var defer = $q.defer();

                skynetPromise.then(function (skynetConnection) {
                    skynetConnection.localdevices({}, function (result) {
                        defer.resolve(result);
                    });
                });

                return defer.promise;
            },

            gatewayConfig: function (options) {
                var defer = $q.defer();

                skynetPromise.then(function (skynetConnection) {
                    skynetConnection.gatewayConfig(options, function (result) {
                        defer.resolve(result);
                    });
                });

                return defer.promise;
            },

            createSubdevice: function (options) {
                return service.gatewayConfig(_.extend({ method: 'createSubdevice' },
                    _.omit(options, reservedProperties)));
            },

            updateSubdevice: function (options) {
                return service.gatewayConfig(_.extend({ method: 'updateSubdevice' },
                    _.omit(options, reservedProperties)));
            },

            deleteSubdevice: function (options) {
                return service.gatewayConfig(_.extend({ method: 'deleteSubdevice' },
                    _.omit(options, reservedProperties)));
            }
        };
    });
