_ = require 'lodash'

class OctoModel
  constructor: (dependencies={}) ->
    @meshblu = dependencies.meshblu

  findManager: (callback=->) =>
    @meshblu.mydevices {}, (data) =>
      octoManagers = _.where data.devices, type: 'octoblu:octo-master'
      octoManagerUuids = _.pluck octoManagers, 'uuid'
      callback _.sample octoManagerUuids

  createDevice: (ownerUuid, callback=->) =>
    deviceProperties =
      type: 'octoblu:octo'
      owner: ownerUuid
      name: 'Octo 1'
      configureWhitelist: [ownerUuid]
      discoverWhitelist: [ownerUuid]
      receiveWhitelist: [ownerUuid]
      sendWhitelist: [ownerUuid]
    @meshblu.register deviceProperties, callback

  create: (ownerUuid, callback=->) =>
    @createDevice ownerUuid, (newDevice) =>
      @findManager (managerUuid) =>
        payload =
          uuid: newDevice.uuid
          token: newDevice.token
        @messageManager 'create-octo', managerUuid, payload
        callback newDevice

  messageManager: (command, managerUuid, payload={}) =>
    deviceMessage =
      payload: payload
      devices: [managerUuid]
      topic: command

    @meshblu.message deviceMessage

  delete: (octoUuid, callback=->) =>
    @findManager (managerUuid) =>
      payload =
        uuid: octoUuid
      @messageManager 'delete-octo', managerUuid, payload
      callback()


module.exports = OctoModel
