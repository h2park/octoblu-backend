_ = require 'lodash'

class OctoModel
  constructor: (dependencies={}) ->
    @meshblu = dependencies.meshblu

  findManagers: (callback=->) =>
    @meshblu.mydevices {}, (data) =>
      octoManagers = _.where data.devices, type: 'octoblu:octo-manager'
      octoManagerUuids = _.pluck octoManagers, 'uuid'
      callback octoManagerUuids

  createDevice: (ownerUuid, callback=->) =>
    deviceProperties =
      type: 'octoblu:octo'
      owner: ownerUuid
      configureWhitelist: [ownerUuid]
      discoverWhitelist: [ownerUuid]
      receiveWhitelist: [ownerUuid]
      sendWhitelist: [ownerUuid]
    @meshblu.register deviceProperties, callback

  create: (ownerUuid, callback=->) =>
    @createDevice ownerUuid, (newDevice) =>
      @findManagers (managers) =>
        payload =
          uuid: newDevice.uuid
          token: newDevice.token
        @messageManagers managers, payload
        callback newDevice

  messageManagers: (command, managers=[], payload={}) =>
    deviceMessage =
      payload: payload
      devices: managers
      topic: command

    @meshblu.message deviceMessage

  delete: (octoUuid, callback=->) =>
    @findManagers (managers) =>
      payload =
        uuid: octoUuid
      @messageManagers 'delete-octo', managers, payload
      callback()


module.exports = OctoModel
