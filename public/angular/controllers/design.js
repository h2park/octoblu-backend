'use strict';

angular.module('octobluApp')
    .controller('designController', function ($rootScope, $scope, $http, $injector, $location, nodeRedService, currentUser) {
        var getSessionFlow = function () {
            $http({method: 'GET', url: '/api/get/flow'})
                .success(function (data, status, headers, config) {
                    console.log('/api/get/flow', data);
                    if (data.flow) {
                        RED.view.importFromCommunity(data.flow);
                    }
                });
        };

        nodeRedService.getPort(currentUser.skynet.uuid, currentUser.skynet.token, function (port) {
            RED.initialize();
            RED.wsConnect(RED.loadSettings, currentUser.skynet.uuid, currentUser.skynet.token, port);
            getSessionFlow();
        });

        $scope.save = function(){
            RED.save();
        };
    });
