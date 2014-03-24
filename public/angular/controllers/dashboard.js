'use strict';

angular.module('e2eApp')
    .controller('dashboardController', function ($rootScope, $scope, $http, $injector, $location, ownerService, channelService, userService) {
        $scope.message = 'Contact page content pending.';

        $rootScope.checkLogin($scope, $http, $injector, false, function () {
            var dataPoints = [];
            var deviceData = [];
            var chart;

            // connect to skynet
            var skynetConfig = {
                'uuid': $scope.skynetuuid,
                'token': $scope.skynettoken
            };

            channelService.getActive($scope.skynetuuid, function (data) {
                $scope.channels = data;
            });

            $scope.eventsTitle = '30 days';

            userService.getEventsGraph($scope.skynetuuid, 'now-30d/d', 'day', function (data) {
                $scope.events = data
            });

//            $scope.toggleInterval = function () {
//                if (!$scope.events || $scope.events.facets.times.interval === 'month') {
//                    userService.getEventsGraph($scope.skynetuuid, 'now-30d/d', 'day', function (data) {
//                        $scope.events = data
//                        $scope.events.hits.title = '30 days';
//                    });
//                } else if ($scope.events.facets.times.interval === 'day') {
//                    userService.getEventsGraph($scope.skynetuuid, 'now-4w/w', 'week', function (data) {
//                        $scope.events = data
//                        $scope.events.hits.title = '4 weeks';
//                    });
//                } else {
//                    userService.getEventsGraph($scope.skynetuuid, 'now-12M/M', 'month', function (data) {
//                        $scope.events = data
//                        $scope.events.hits.title = '1 year';
//                    });
//                }
//            };

            skynet(skynetConfig, function (e, socket) {
                if (e) throw e;

                // Get user's devices
                ownerService.getDevices($scope.skynetuuid, $scope.skynettoken, function (data) {
                    $scope.devices = data.devices;

                    // Subscribe to user's devices messages and events
                    if (data.devices) {
                        _.each(data.devices, function (device) {
                            socket.emit('subscribe', {
                                'uuid': device.uuid,
                                'token': device.token
                            }, function (data) {
                                // console.log(data);
                            });

                            // Setup dashboard arrays for devices
                            dataPoints.push({label: device.name, y: 0, uuid: device.uuid });
                            deviceData[device.uuid] = 0;
                        });
                    }

                    // http://canvasjs.com/ << TODO: pucharse $299
                    chart = new CanvasJS.Chart('chartContainer', {
                        theme: 'theme2',//theme1
                        title: {
                            //text: 'Real-time Device Activity'
                        },
                        data: [
                            {
                                // Change type to 'column', bar', 'splineArea', 'area', 'spline', 'pie',etc.
                                type: 'splineArea',
                                dataPoints: dataPoints
                            }
                        ]
                    });

                    chart.render();

                });

                socket.on('message', function(channel, message){

                    if($scope.skynetuuid == channel){
                        alert(JSON.stringify(message));
                    }

                    console.log('message received', channel, message);
                    deviceData[channel] = deviceData[channel] + 1;
                    for (var i = 0; i < dataPoints.length; i++) {
                        if(dataPoints[i].uuid == channel){
                            dataPoints[i].y = deviceData[channel];
                        }
                    }
                    chart.options.data[0].dataPoints = dataPoints
                    chart.render();

                });
            });

        });
    });