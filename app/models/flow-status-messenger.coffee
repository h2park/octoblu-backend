MeshbluHttp = require 'meshblu-http'
config      = require '../../config/auth'

class FlowStatusMessenger
  constructor: (options={}) ->
    {@userUuid, @userToken, @flowUuid, @workflow, @deploymentUuid} = options

    @meshbluHttp = new MeshbluHttp
      hostname: config.skynet.hostname
      port: config.skynet.port
      protocol: config.skynet.protocol
      uuid: @userUuid,
      token: @userToken

  message: () =>


module.exports = FlowStatusMessenger
