'use strict';

angular.module('octobluApp')
    .controller('addChannelNoauthController', function($scope, $state, nodeType, currentUser, userService, channelService) {
        $scope.activate = function(){
            userService.activateNoAuthChannel(currentUser.skynetuuid, nodeType.channel._id, function (data) {
                channelService.getActiveChannels(true);
                channelService.getAvailableChannels(true);
                $state.go('ob.connector.channels.detail', {id: nodeType.channel._id});
            });
        };
    });
