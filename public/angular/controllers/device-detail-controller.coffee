
class DeviceDetailController
  @TABS:
    properties: 0
    permissions: 1

  constructor: ($scope, $state, $stateParams, deviceService, ThingService) ->
    @state = $state
    @activeTabIndex = DeviceDetailController.TABS[$stateParams.tab]
    @ThingService = ThingService

    deviceService.getDeviceByUUID($stateParams.uuid).then (device) =>
      @device = device
      @options = @device.options
      @optionsSchema = @device.optionsSchema

    @ThingService.getThings().then (devices) =>
      @devices = devices

    $scope.$watch 'controller.device',  @updatePermissions, true
    $scope.$watch 'controller.device',  @updateSchemas, true
    $scope.$watch 'controller.permissions', @updateDevice, true
    $scope.$watch 'controller.device.name', @saveDevice
    $scope.$watch 'controller.options',  @saveDevice, true

  generateSessionToken: =>
    @ThingService.generateSessionToken(@device).then (token) =>
      alert token

  onTabSelection: (tabName) =>
    return unless @device?
    @state.go 'material.newDeviceTab', {uuid: @device.uuid, tab: tabName}, notify: false

  saveDevice: =>
    return unless @device?
    @device.options = @options
    @ThingService.updateDevice _.pick(@device, 'uuid', 'name', 'options')

  updatePermissions: =>
    @permissions = @ThingService.mapWhitelistsToPermissions @device

  updateDevice: =>
    return unless @permissions?
    @ThingService.updateDeviceWithPermissions @device, @permissions

  updateSchemas: =>
    return unless @device?
    _.extend @options, @device.options
    _.extend @optionsSchema, @device.optionsSchema

angular.module 'octobluApp'
       .controller 'DeviceDetailController', DeviceDetailController
