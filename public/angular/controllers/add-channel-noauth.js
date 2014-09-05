'use strict';

angular.module('octobluApp')
    .controller('addChannelNoauthController', function($scope, $state, nodeType, currentUser, userService, channelService) {
        $scope.activate = function(){
            userService.activateNoAuthChannel(currentUser.skynetuuid, nodeType.channelid, function (data) {
                channelService.getActiveChannels(true);
                channelService.getAvailableChannels(true);
                $state.go('ob.connector.nodes.channel-detail', {id: nodeType.channelid});
            });
        };
    });
