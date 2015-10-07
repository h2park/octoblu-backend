_ = require 'lodash'
UserSession = require '../../models/user-session-model'
debug = require('debug')('octoblu:flow-interval-nodes-transform')
INTERVAL_SERVICE_UUID = "765bd3a4-546d-45e6-a62f-1157281083f0"
class FlowIntervalNodesTransform

  constructor: (dependencies={}) ->
    @Flow = dependencies.Flow || require '../../models/flow'
    @intervalServiceUUID = INTERVAL_SERVICE_UUID

  updateIntervalNodes:(request, response, next=->)->
    # return next()
    return next() unless request.user?
    @Flow.getFlowWithOwner(request.params?.id, request.user.uuid).then (flow)=>
      return next() if _.isEmpty @getIntervalNodesWithoutDeviceId(flow)



  getIntervalNodesWithoutDeviceId: (flow) ->
    intervalNodes = _.filter flow.nodes, (flowNode) ->
      _.contains(['interval', 'debounce', 'throttle', 'schedule', 'delay'], flowNode.class) and not flowNode.deviceId?

module.exports = FlowIntervalNodesTransform
