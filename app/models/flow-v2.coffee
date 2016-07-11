_           = require 'lodash'
When        = require 'when'
request     = require 'request'
MeshbluHttp = require 'meshblu-http'

class FlowModelV2
  constructor: () ->

  getFlows: (ownerUUID, meshbluJSON, callback) =>
    @getMyDevices(ownerUUID, meshbluJSON)
    .then (flows) =>
      callback null, flows
    .catch (error) =>
      callback error

  getMyDevices: (ownerUUID, meshbluJSON) =>
    meshbluHttp = new MeshbluHttp(meshbluJSON)
    When.promise (resolve, reject) =>
      meshbluHttp.mydevices { type: 'octoblu:flow', 'owner': ownerUUID }, (error, data) =>
        return reject error if error?
        flows = _.map data.devices, @_mapFlow
        flows = _.filter flows, (flow) =>
          flow?
        resolve flows

  getSomeFlows: (ownerUUID, meshbluJSON, limit, callback) =>
    @getMyDevices(ownerUUID, meshbluJSON)
    .then (flows) =>
      flows = _.take flows, limit
      callback null, flows
    .catch (error) =>
      callback error

  _mapFlow: (flow) =>
    return @_updateMeshbluFlow(flow) unless flow.draft?
    return updatedFlow =
      name: flow.draft.name
      flowId: flow.draft.flowId
      online: flow.online
      nodes: flow.draft.nodes
      description: flow.draft.description

  _updateMeshbluFlow: (device) =>
    return null unless device.flow?
    @_migrateAndUseDraft device
    return updatedFlow =
      name: device.flow.name
      flowId: device.uuid
      online: device.online
      nodes: device.flow.nodes
      description: device.flow.description || ''

  _migrateAndUseDraft: (flowDevice) =>
    { flow } = flowDevice
    options =
      name: flow.name
      draft: flow
      octoblu: @_createOctobluLinks flowDevice.uuid
    meshbluHttp.update flowDevice.uuid, options, (error) =>
      console.log error

  _createOctobluLinks: (flowUuid) =>
    hostname = 'octoblu.dev'
    hostname = 'octoblu.com' if process.env.NODE_ENV == 'production'
    octobluLinks =
      links: [
        {
          title: 'Publish IoT App'
          url: 'https://bluprinter.' + hostname + '/flows/' + flowUuid + '/new'
        }
      ]
    return octobluLinks


  _applyProjections: (flows, projections) =>
    return flows if _.isEmpty projections

module.exports = new FlowModelV2
