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
        return reject(error) if error?
        flows = @_filterFlows data.devices
        resolve flows

  getSomeFlows: (ownerUUID, meshbluJSON, limit, callback) =>
    @getMyDevices(ownerUUID, meshbluJSON)
    .then (flows) =>
      flows = _.take flows, limit
      callback null, flows
    .catch (error) =>
      callback error

  _filterFlows: (flows) =>
    updatedFlows = _.map flows, (flow) =>
      @_mapFlow flow
    updatedFlows

  _mapFlow: (flow) =>
    return @_noDraft(flow) unless flow.draft?
    return updatedFlow =
      name: flow.draft.name
      flowId: flow.draft.flowId
      online: flow.online
      nodes: flow.draft.nodes
      description: flow.draft.description

  _noDraft: (flow) =>
    #migrate flow here

    return updatedFlow =
      name: flow.name
      flowId: flow.uuid
      online: flow.online
      description: flow.description || ''

  _migrateAndUseDraft: (flowDevice) =>
    #get flow from db

    options =
      name: flow.name
      draft: flow
      octoblu: _createOctobluLinks flowDevice.uuid
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
