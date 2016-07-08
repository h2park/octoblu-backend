_           = require 'lodash'
When        = require 'when'
request     = require 'request'
MeshbluHttp = require 'meshblu-http'

class FlowModelV2
  constructor: () ->

  getFlows: (meshbluJSON, callback) =>
    @getMyDevices(meshbluJSON)
    .then (flows) =>
      callback null, flows
    .catch (error) =>
      callback error

  getMyDevices: (meshbluJSON) =>
    meshbluHttp = new MeshbluHttp(meshbluJSON)
    When.promise (resolve, reject) =>
      meshbluHttp.mydevices { type: 'octoblu:flow' }, (error, {devices}={}) =>
        return reject(error) if error?
        resolve _.pluck(devices, 'draft')
  
module.exports = new FlowModelV2
