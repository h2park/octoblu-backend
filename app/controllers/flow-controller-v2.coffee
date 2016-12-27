_ = require 'lodash'


class FlowControllerV2
  constructor: (options={}) ->
    @Flow    = options.Flow || require '../models/flow-v2'
    @meshbluJSON = options.meshbluJSON

  getSomeFlows: (request, response) =>
    return response.send 403, error unless request.user.resource.uuid?
    config = _.extend {}, @meshbluJSON, {token: request.token, uuid: request.uuid}
    limit = parseInt(request.params.limit)

    @Flow.getSomeFlows request.user.resource.uuid, config, limit, (error, flows) =>
      return response.send 422, error if error?
      return response.send 200, flows

  getFlows: (request, response) =>
    return response.send 403, error unless request.user.resource.uuid?
    config = _.extend {}, @meshbluJSON, {token: request.token, uuid: request.uuid}
    console.log(config)
    @Flow.getFlows request.user.resource.uuid, config, (error, flows) =>
      console.log(error)
      return response.send 422, error if error?
      return response.send 200, flows

  migrateNoDraftFlows: (request, response, next) =>
    return response.send 403, error unless request.user.resource.uuid?
    config = _.extend {}, @meshbluJSON, {token: request.token, uuid: request.uuid}
    @Flow.migrateNoDraftFlows request.user.resource.uuid, config, (error) =>
      return response.send 422, error if error?
      next()

module.exports = FlowControllerV2
