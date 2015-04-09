
TABS =
  properties: 0
  permissions: 1

class DeviceDetailController
  constructor: ($scope, $state, $stateParams, deviceService, ThingService) ->
    @state = $state
    @activeTabIndex = TABS[$stateParams.tab]

    deviceService.getDeviceByUUID($stateParams.uuid).then (device) =>
      @device = device
      window.device = device

    ThingService.getThings().then (devices) =>
      @devices = devices

  onTabSelection: (tabName) =>
    return unless @device?
    @state.go 'material.newDeviceTab', {uuid: @device.uuid, tab: tabName}, notify: false


angular.module 'octobluApp'
       .controller 'DeviceDetailController', DeviceDetailController
