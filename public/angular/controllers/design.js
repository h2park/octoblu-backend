// 'use strict';

'use strict';

angular.module('octobluApp')
    .controller('designController', function ($rootScope, $scope, $http, $injector, $location, nodeRedService) {
        $scope.getSessionFlow = function () {
            $http({method: 'GET', url: '/api/get/flow'})
                .success(function (data, status, headers, config) {
                    console.log(data);
                    if (data.flow) {
                        var win = angular.element('#designerFrame')[0];
                        win.onload = function () {
                            win.contentWindow.postMessage(data.flow, $scope.redFrame);
                        };
                    }
                });
        };

        // Get NodeRed port number
        nodeRedService.getPort($scope.currentUser.skynet.uuid, $scope.currentUser.skynet.token, function (data) {
            $scope.redPort = data.replace(/["']/g, "");
            $scope.redFrame = "https://" + $scope.currentUser.skynet.uuid + ":" + $scope.currentUser.skynet.token + "@designer.octoblu.com:" + $scope.redPort;

            $scope.getSessionFlow();

            $scope.designerFrame = {
                skynetid: $scope.currentUser.skynet.uuid,
                skynettoken: $scope.currentUser.skynet.token
            };
        });
    });