_           = require 'lodash'
When        = require 'when'
request     = require 'request'
MeshbluHttp = require 'meshblu-http'
async       = require 'async'
config      = require '../../config/auth.js'

class FlowModelV2
  constructor: () ->

  getFlows: (ownerUUID, meshbluJSON, callback) =>
    @getMyDevices(ownerUUID, meshbluJSON)
    .then (flows) =>
      callback null, flows
    .catch (error) =>
      callback error

  getSomeFlows: (ownerUUID, meshbluJSON, limit, callback) =>
    @getMyDevices(ownerUUID, meshbluJSON)
    .then (flows) =>
      flows = _.take flows, limit
      callback null, flows
    .catch (error) =>
      callback error

  getMyDevices: (ownerUUID, meshbluJSON) =>
    meshbluHttp = new MeshbluHttp(meshbluJSON)
    When.promise (resolve, reject) =>
      query = owner: ownerUUID, type: 'octoblu:flow'
      options = projection: {draft: true, name: true, uuid: true, online: true}
      meshbluHttp.search query, options, (error, devices) =>
        return reject error if error?
        flows = _.compact _.map devices, @_mapFlow
        resolve flows

  _mapFlow: (flow) =>
    return {
      name: flow.draft?.name || flow.name || flow.uuid
      flowId: flow.draft?.flowId || flow.uuid
      online: flow.online
      nodes: flow.draft?.nodes || []
      description: flow.draft?.description
    }

  migrateNoDraftFlows: (ownerUUID, meshbluJSON, callback) =>
    meshbluHttp = new MeshbluHttp(meshbluJSON)
    query = {owner: ownerUUID, flow: {$exists: true}, draft: {$exists: false}, type: 'octoblu:flow'}
    meshbluHttp.search query, {}, (error, devices) =>
      return callback error if error?
      async.eachSeries devices, async.apply(@_migrateFlow, meshbluHttp), callback
    return

  _migrateFlow: (meshbluHttp, flowDevice, callback) =>
    { flow } = flowDevice
    options =
      name: flow.name
      draft: flow
      octoblu: @_createOctobluLinks flowDevice.uuid
    meshbluHttp.update flowDevice.uuid, options, callback

  _createOctobluLinks: (flowUuid) =>
    octobluLinks =
      links: [
        {
          title: 'Publish IoT App Bluprint'
          url: "https://bluprinter#{config.domain}/bluprints/setup/new/#{flowUuid}"
        }
      ]

    return octobluLinks

  _applyProjections: (flows, projections) =>
    return flows if _.isEmpty projections

module.exports = new FlowModelV2
