MeshbluHttp = require 'meshblu-http'

class WebhookController
  constructor: (options={}) ->
    @Flow = options.Flow ? require '../models/flow'
    @meshbluHttp = new MeshbluHttp options.meshbluJSON

  trigger: (request, response) =>
    triggerId = request.params.id
    @Flow.findOne 'nodes.id': triggerId
      .then (flow) =>
        message =
          devices: [flow.flowId]
          topic: 'webhook'
          payload:
            from: triggerId
            params: request.body

        @meshbluHttp.message message
        response.status(201).end()
      .then null, (err) =>
        response.status(404).end()

module.exports = WebhookController
