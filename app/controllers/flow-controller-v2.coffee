_ = require 'lodash'

class FlowControllerV2
  constructor: (options={}) ->
    @Flow    = options.Flow || require '../models/flow-v2'
    @meshbluJSON = options.meshbluJSON

  getSomeFlows: (request, response) =>
    return response.sendStatus(403) unless request.user.resource.uuid?
    config = _.extend {}, @meshbluJSON, {token: request.token, uuid: request.uuid}
    limit = parseInt(request.params.limit)
    @Flow.getSomeFlows request.user.resource.uuid, config, limit, (error, flows) =>
      return response.sendError error if error?
      return response.status(200).send flows

  getFlows: (request, response) =>
    return response.sendStatus(403) unless request.user.resource.uuid?
    config = _.extend {}, @meshbluJSON, {token: request.token, uuid: request.uuid}
    @Flow.getFlows request.user.resource.uuid, config, (error, flows) =>
      return response.sendError error if error?
      return response.status(200).send flows

  migrateNoDraftFlows: (request, response, next) =>
    return response.sendStatus(403) unless request.user.resource.uuid?
    config = _.extend {}, @meshbluJSON, {token: request.token, uuid: request.uuid}
    @Flow.migrateNoDraftFlows request.user.resource.uuid, config, (error) =>
      return response.sendError error if error?
      next()

  _createError: (message, code) =>
    error = new Error message
    _.set error, 'code', code ? 500
    return error

  _setErrorCode: (error, code) =>
    return @_createError(error, code) unless _.isString error
    _.set error, 'code', code ? 500
    return error

module.exports = FlowControllerV2
