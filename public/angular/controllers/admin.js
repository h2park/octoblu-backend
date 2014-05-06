'use strict';

angular.module('octobluApp')
    .controller('adminController', function($rootScope, $scope, $cookies, $state, ownerService, userService, GroupService ) {

    })
    .controller('adminGroupDetailController', function($rootScope, $scope, $cookies) {

    })
    .controller('invitationController', function($rootScope, $cookies, $scope, InvitationService ) {
        //Send the invitation
        $scope.recipientEmail = '';

        $scope.send = function( ){

            var invitationPromise = InvitationService.sendInvitation({
                'uuid' : $cookies.skynetuuid,
                'token' : $cookies.skynettoken
            }, $scope.recipientEmail );

            invitationPromise.then(function(invitation){
                /*
                   Display a successful notification to the user. Use a notification, not a modal
                 */

            }, function(result){
                /*
                 *Display an error notification to the user
                 */

            });

        };

    });