_ = require 'lodash'


class FlowControllerV2
  constructor: (options={}) ->
    @Flow    = options.Flow || require '../models/flow-v2'
    @meshbluJSON = options.meshbluJSON;

  getSomeFlows: (request, response) =>
    config = _.extend {}, @meshbluJSON, {token: request.token, uuid: request.uuid}
    @Flow.getSomeFlows request.user.resource.uuid, config, parseInt(request.params.limit), (error, flows) =>
      return response.send 422, error if error?
      return response.send 200, flows

  getFlows: (request, response) =>
    config = _.extend {}, @meshbluJSON, {token: request.token, uuid: request.uuid}
    @Flow.getFlows request.user.resource.uuid, config, (error, flows) =>
      return response.send 422, error if error?
      return response.send 200, flows

module.exports = FlowControllerV2
