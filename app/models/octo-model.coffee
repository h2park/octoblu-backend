_ = require 'lodash'

class OctoModel
  constructor: (dependencies={}) ->
    @meshblu = dependencies.meshblu

  findManagers: (callback=->) =>
    @meshblu.mydevices {}, (data) =>
      octoManagers = _.where data.devices, type: 'octoblu:octo-master'
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
      @findManagers (managerUuids) =>
        payload =
          uuid: newDevice.uuid
          token: newDevice.token
        @messageManagers 'create-octo', managerUuids, payload
        callback newDevice

  messageManagers: (command, managerUuids=[], payload={}) =>
    deviceMessage =
      payload: payload
      devices: managerUuids
      topic: command

    @meshblu.message deviceMessage

  delete: (octoUuid, callback=->) =>
    @findManagers (managerUuids) =>
      payload =
        uuid: octoUuid
      @messageManagers 'delete-octo', managerUuids, payload
      callback()


module.exports = OctoModel
