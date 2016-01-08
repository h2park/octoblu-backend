MeshbluHttp = require 'meshblu-http'
config      = require '../../config/auth'

class FlowStatusMessenger
  constructor: (options={}) ->
    {@userUuid, @userToken, @flowUuid, @workflow, @deploymentUuid} = options

    @meshbluHttp = new MeshbluHttp
      server: config.skynet.host
      port: config.skynet.port
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
