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

  message: (state,message) =>
    @meshbluHttp.message
      devices: [config.flow_logger_uuid]
      payload:
        application: 'api-octoblu'
        date: Date.now()
        deploymentUuid: @deploymentUuid
        flowUuid: @flowUuid
        userUuid: @userUuid
        workflow: @workflow
        state:    state
        message:  message


module.exports = FlowStatusMessenger
