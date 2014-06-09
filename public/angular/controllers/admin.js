'use strict';

angular.module('octobluApp')
    .controller('adminController', function (allGroupResourcePermissions, $rootScope, $scope, $modal, $log, $cookies, currentUser, allDevices, GroupService, PermissionsService) {
        $scope.user = currentUser;
        $scope.allDevices = allDevices;
        $scope.allGroupResourcePermissions = allGroupResourcePermissions;
        $scope.ownedDevices = allDevices;

        $scope.addResourcePermission = function () {
            if ($scope.resourcePermissionName) {
                var resourcePermission;

                PermissionsService.add(currentUser.skynetuuid, currentUser.skynettoken, { name: $scope.resourcePermissionName })
                    .then(function (newResourcePermission) {
                        resourcePermission = newResourcePermission;
                        $scope.groupResourcePermissions.push(resourcePermission);
                        return resourcePermission;
                    })
                    .then(function (resourcePermission) {
                        return GroupService.addGroup(resourcePermission.resource.uuid + '_sources', currentUser.skynetuuid, currentUser.skynettoken);
                    })
                    .then(function (sourceGroup) {
                        resourcePermission.source = sourceGroup.resource;
                        $scope.groupIndex[sourceGroup.resource.uuid] = sourceGroup;
                        return GroupService.addGroup(resourcePermission.resource.uuid + '_targets', currentUser.skynetuuid, currentUser.skynettoken);
                    })
                    .then(function (targetGroup) {
                        resourcePermission.target = targetGroup.resource;
                        $scope.groupIndex[targetGroup.resource.uuid] = targetGroup;
                        PermissionsService.update(currentUser.skynetuuid, currentUser.skynettoken, resourcePermission);
                    });
            }
        };

        $scope.deleteResourcePermission = function (resourcePermission) {
            $rootScope.confirmModal($modal, $scope, $log,
                'Confirm Delete Group', 'Are you sure you want to delete ' + resourcePermission.name + ' group?',
                function () {
                    PermissionsService.delete(currentUser.skynetuuid, currentUser.skynettoken, resourcePermission.resource.uuid);
                });
        };

        $scope.getDeviceImageUrl = function (device) {
            if (device && device.type === 'gateway') {
                return '/assets/images/network_hub.png';
            }
            return '/assets/images/robot8.png';
        };
    })
    .controller('adminGroupDetailController', function ($scope, PermissionsService, $stateParams, resourcePermission, sourcePermissionGroup, targetPermissionGroup) {
        $scope.resourcePermission = resourcePermission;
        $scope.sourcePermissionGroup = sourcePermissionGroup;
        $scope.targetPermissionGroup = targetPermissionGroup;

        $http.defaults.headers.common.ob_skynetuuid = currentUser.skynetuuid;
        $http.defaults.headers.common.ob_skynettoken = currentUser.skynettoken;

        $scope.$watch('resourcePermission.permissions', function (newValue, oldValue, scope) {
            if (newValue && oldValue) {
                var resourcePermission = scope.resourcePermission;
                PermissionsService.update(
                    { uuid: resourcePermission.uuid},
                    {permissions: resourcePermission.permissions}
                ).$promise.then(function (updatedResourcePermission) {
                        console.log('resource permission saved');
                        console.log(updatedResourcePermission);
                    }, function (error) {
                        console.log('error saving resource permission');
                        console.log(error);

                    });
            }
        }, true);


        $scope.$watchCollection('sourcePermissionsGroup.members', function (newValue, oldValue, scope) {
            if (newValue && oldValue) {
                console.log('sourcePermissionsGroup udpated');
                if (newValue.length != oldValue.length) {
                    var groupPromise = GroupService.updateGroup(scope.user.skynetuuid, scope.user.skynettoken, scope.sourcePermissionsGroup);

                    groupPromise.then(function (updatedGroup) {
                        scope.sourcePermissionsGroup = updatedGroup;
                        console.log('sourcePermissionsGroup has been saved');

                    }, function (error) {

                    });
                }
            }
        }, true);

        $scope.$watchCollection('targetPermissionsGroup.members', function (newValue, oldValue) {
            if (newValue && oldValue) {
                if (newValue.length != oldValue.length) {
                    var groupPromise = GroupService.updateGroup($scope.user.skynetuuid, $scope.user.skynettoken, $scope.targetPermissionsGroup);
                    groupPromise.then(function (updatedGroup) {
                        $scope.targetPermissionsGroup = updatedGroup;
                    }, function (error) {

                    });

                }
            }
        }, true);

        /*
         removeResourceFromSourcePermissionsGroup
         check if the resource
         */
        $scope.removeResourceFromSourcePermissionsGroup = function (resource) {
            var existingSourcePermissionsResource = _.findWhere($scope.sourcePermissionsGroup.members, {uuid: resource.uuid });
            if (existingSourcePermissionsResource) {
                $scope.sourcePermissionsGroup.members = _.without($scope.sourcePermissionsGroup.members,
                    _.findWhere($scope.sourcePermissionsGroup.members,
                        { uuid: resource.uuid }));
                var existingTargetGroupMember = _.findWhere($scope.targetPermissionsGroup.members, {uuid: resource.uuid });
                //If the resource is not in the target group, you should remove it from the parent group
                if (!existingTargetGroupMember) {
                    $scope.group.members =
                        _.without($scope.group.members, _.findWhere($scope.group.members, { uuid: resource.uuid }));

                }
            }
        };

        $scope.removeResourceFromTargetPermissionsGroup = function (resource) {
            var existingTargetPermissionsResource = _.findWhere($scope.targetPermissionsGroup.members, {uuid: resource.uuid });
            if (existingTargetPermissionsResource) {
                $scope.targetPermissionsGroup.members = _.without($scope.targetPermissionsGroup.members,
                    _.findWhere($scope.targetPermissionsGroup.members,
                        { uuid: resource.uuid }));
                var existingSourcePermissionsGroupMember = _.findWhere($scope.sourcePermissionsGroup.members, {uuid: resource.uuid});
                //If the resource is not in the source permissions group, you should remove it from members list in the parent group
                if (!existingSourcePermissionsGroupMember) {
                    $scope.group.members = _.without($scope.group.members,
                        _.findWhere($scope.group.members,
                            { uuid: resource.uuid })
                    );
                }
            }
        };

        $scope.addResourceToTargetPermissionsGroup = function (resource) {
            var existingPermissionsResource = _.findWhere($scope.targetPermissionsGroup.members, {uuid: resource.uuid});
            console.log(resource);
            if (!existingPermissionsResource) {
                $scope.targetPermissionsGroup.members.push(resource);
                var existingGroupMember = _.findWhere($scope.group.members, {uuid: resource.uuid});
                if (!existingGroupMember) {
                    $scope.group.members.push(resource);
                }
            }
        };

        $scope.addResourceToSourcePermissionsGroup = function (resource) {
            var existingPermissionsResource = _.findWhere($scope.sourcePermissionsGroup.members, {uuid: resource.uuid});
            if (!existingPermissionsResource) {
                $scope.sourcePermissionsGroup.members.push(resource);
                var existingGroupMember = _.findWhere($scope.group.members, {uuid: resource.uuid});
                if (!existingGroupMember) {
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