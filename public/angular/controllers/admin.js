'use strict';

angular.module('octobluApp')
    .controller('adminController', function ($rootScope, $scope, $modal, $log, $cookies, currentUser, allDevices,  GroupService) {
        $scope.controller = 'admin';
        $scope.errors = [];
        $scope.user = currentUser;
        $scope.allDevices = allDevices;

       GroupService.getAllGroups(currentUser.skynetuuid, currentUser.skynettoken)
           .then(function(groups){
            $scope.allGroups = groups || [];
            $scope.operatorsGroup = _.findWhere(groups, {'type' : 'operators'}) || {};
            $scope.allResources = _.union(_.pluck($scope.allDevices, 'resource'), $scope.operatorsGroup.members);
       }, function(error){
           console.log(error);
           $scope.allGroups = [];

       });

        $scope.ownedDevices = allDevices;

        $scope.addGroup = function () {

            if ($scope.groupName) {
                GroupService.addGroup($scope.groupName, $cookies.skynetuuid, $cookies.skynettoken)
                    .then(function (group) {
                        $scope.allGroups.push(group);
                        $scope.groupName = '';
                    },
                    function (errorResult) {
                        //TODO - Add notification errors to be displayed
                    });
            }
        };

        $scope.deleteGroup = function (group) {

            console.log('Deleting group');
            $rootScope.confirmModal($modal, $scope, $log,
                'Confirm Delete Group', 'Are you sure you want to delete ' + group.name + ' group?',
                function () {
                    var groupPromise = GroupService.deleteGroup($scope.user.skynetuuid, $scope.user.skynettoken, group.uuid);
                    groupPromise.then(function (result) {
                        return GroupService.getAllGroups($scope.user.skynetuuid, $scope.user.skynettoken);
                    }).then(function(groups){
                        $scope.allGroups = groups;
                    }, function (result) {
                        console.log(JSON.stringify(result));
                    });
                },
                function () {

                });


        };

        $scope.getDeviceImageUrl = function (device) {
            if (device && device.type === 'gateway') {
                return '/assets/images/network_hub.png';
            }
            return '/assets/images/robot8.png';
        };
    })
    .controller('adminGroupDetailController', function ($scope, $stateParams, $cookies, $http, currentUser, currentGroup, resourcePermission, GroupService, PermissionService) {
        $scope.controller = 'detail';
        $scope.user = currentUser;
        $scope.group = currentGroup;
        $scope.resourcePermission = resourcePermission;

        $http.defaults.headers.common['ob_skynetuuid'] = currentUser.skynetuuid;
        $http.defaults.headers.common['ob_skynettoken'] = currentUser.skynettoken;

        GroupService.getGroup(currentUser.skynetuuid, currentUser.skynettoken, resourcePermission.source.uuid)
            .then(function(sourceGroup){
                $scope.sourcePermissionsGroup = sourceGroup;
            });

        GroupService.getGroup(currentUser.skynetuuid, currentUser.skynettoken, resourcePermission.target.uuid)
            .then(function(targetGroup){
                $scope.targetPermissionsGroup = targetGroup;
            });


        $scope.$watchCollection('group.members', function(newValue, oldValue){
            if(newValue && oldValue ){
                console.log('group udpated');
                if(newValue.length != oldValue.length ){
                    var groupPromise = GroupService.updateGroup($scope.user.skynetuuid, $scope.user.skynettoken, $scope.group);

                    groupPromise.then(function(updatedGroup){
                        $scope.group = updatedGroup;
                        var oldGroup = _.findWhere($scope.allGroups, {uuid : updatedGroup.uuid});
                        oldGroup.members = updatedGroup.members;
                    }, function(error){
                    });
                }
            }
        }, true);

        $scope.$watch('resourcePermission.permissions', function(newValue, oldValue, scope){
            if(newValue && oldValue){
                console.log('resourcePermission.permissions updated');
                var resourcePermission = scope.resourcePermission;
                PermissionService.update(
                    {
                        uuid : resourcePermission.uuid
                    },
                    {
                        uuid : newValue.uuid,
                        resource : resourcePermission.resource,
                        permissions : resourcePermission.permissions,
                        source : {uuid : resourcePermission.source.resource.uuid, type : resourcePermission.source.resource.type},
                        target : {uuid : resourcePermission.target.resource.uuid, type : resourcePermission.target.resource.type},
                        grantedBy : resourcePermission.grantedBy
                    }
                ).$promise.then(function(updatedResourcePermission){
                        console.log('resource permission saved');
                        console.log(updatedResourcePermission);
                    }, function(error){
                        console.log('error saving resource permission');
                        console.log(error);

                    });
            }
        }, true);


        $scope.$watchCollection('sourcePermissionsGroup.members', function(newValue, oldValue, scope){
            if(newValue && oldValue ){
                console.log('sourcePermissionsGroup udpated');
                if(newValue.length != oldValue.length ){
                    var groupPromise = GroupService.updateGroup(scope.user.skynetuuid, scope.user.skynettoken, scope.sourcePermissionsGroup);

                        groupPromise.then(function(updatedGroup){
                            scope.sourcePermissionsGroup = updatedGroup;
                            console.log('sourcePermissionsGroup has been saved');

                        }, function(error){

                        });

                }
            }
        }, true);

        $scope.$watchCollection('targetPermissionsGroup.members', function(newValue, oldValue){

            if(newValue && oldValue ){
                if(newValue.length != oldValue.length ){
                    var groupPromise =  GroupService.updateGroup($scope.user.skynetuuid, $scope.user.skynettoken, $scope.targetPermissionsGroup);
                    groupPromise.then(function(updatedGroup){
                        $scope.targetPermissionsGroup = updatedGroup;
                    }, function(error){

                        });

                }
            }
        }, true);

        /*
           removeResourceFromSourcePermissionsGroup
           check if the resource 
         */
        $scope.removeResourceFromSourcePermissionsGroup = function (resource) {
            var existingSourcePermissionsResource = _.findWhere($scope.sourcePermissionsGroup.members, {uuid : resource.uuid });
            if( existingSourcePermissionsResource ){
                $scope.sourcePermissionsGroup.members = _.without($scope.sourcePermissionsGroup.members,
                                                                    _.findWhere($scope.sourcePermissionsGroup.members, 
                                                                        { uuid : resource.uuid }));
                var existingTargetGroupMember = _.findWhere($scope.targetPermissionsGroup.members, {uuid : resource.uuid });
                //If the resource is not in the target group, you should remove it from the parent group
                if( ! existingTargetGroupMember){
                    $scope.group.members =
                        _.without($scope.group.members, _.findWhere($scope.group.members, { uuid : resource.uuid }) );

                }
            }
        };

        $scope.removeResourceFromTargetPermissionsGroup = function (resource) {
            var existingTargetPermissionsResource = _.findWhere($scope.targetPermissionsGroup.members, {uuid : resource.uuid });
            if( existingTargetPermissionsResource ){
                $scope.targetPermissionsGroup.members = _.without($scope.targetPermissionsGroup.members,
                    _.findWhere($scope.targetPermissionsGroup.members,
                        { uuid : resource.uuid }));
                var existingSourcePermissionsGroupMember = _.findWhere($scope.sourcePermissionsGroup.members, {uuid: resource.uuid});
                //If the resource is not in the source permissions group, you should remove it from members list in the parent group
                if( ! existingSourcePermissionsGroupMember){
                    $scope.group.members =  _.without($scope.group.members,
                        _.findWhere($scope.group.members,
                            { uuid : resource.uuid })
                    );
                }
            }
        };

        $scope.addResourceToTargetPermissionsGroup = function (resource) {
            var existingPermissionsResource = _.findWhere($scope.targetPermissionsGroup.members, {uuid: resource.uuid});
            console.log(resource);
            if( ! existingPermissionsResource ){
                $scope.targetPermissionsGroup.members.push(resource);
                var existingGroupMember = _.findWhere($scope.group.members, {uuid: resource.uuid});
                if( ! existingGroupMember){
                    $scope.group.members.push(resource);
                }
            }
        };

        $scope.addResourceToSourcePermissionsGroup = function (resource) {
            var existingPermissionsResource = _.findWhere($scope.sourcePermissionsGroup.members, {uuid: resource.uuid});
            if( ! existingPermissionsResource ){
                $scope.sourcePermissionsGroup.members.push(resource);
                var existingGroupMember = _.findWhere($scope.group.members, {uuid: resource.uuid});
                if( ! existingGroupMember){
                    $scope.group.members.push(resource);
                }
            }
        };

    })
    .controller('invitationController', function ($rootScope, $cookies, $scope, userService, InvitationService) {

        //Send the invitation
        $scope.recipientEmail = '';

        $scope.send = function () {

            var invitationPromise = InvitationService.sendInvitation({
                'uuid': $cookies.skynetuuid,
                'token': $cookies.skynettoken
            }, $scope.recipientEmail);

            invitationPromise.then(function (invitation) {
                $scope.recipientEmail = '';


            }, function (result) {
                /*
                 *TODO - Display an error notification to the user
                 */
            });
        };

    });