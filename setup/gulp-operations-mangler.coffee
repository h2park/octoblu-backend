_ = require 'lodash'
{Transform} = require 'stream'
request = require 'request'
class OperationsMangler extends Transform
  constructor: (options) ->
    super objectMode: true
    {@nodeRegistryUrl} = options

  _transform: (file, enc, next) =>
    operations = JSON.parse(file.contents.toString());
    unless @nodeRegistryUrl?
      console.error "Can't find the local nanocyte registry. run nanomux"
      @push operations
      return next()

    request url: @nodeRegistryUrl, json: true, (error, response, nodeRegistry) =>
      if error?
        console.error "error reading the local nanocyte registry. run nanomux"
        @push operations
        return next()

      @push @mangle operations, nodeRegistry
      next()

  mangle: (operations, nodeRegistry) =>
    mangledOperations = _.map operations, (operation) =>
      return operation unless operation.deviceId?

      registeredNode = nodeRegistry[operation.class]
      return operation unless registeredNode?
      operation.deviceId = registeredNode.sendWhitelist[0] if registeredNode.sendWhitelist      
      return operation

    return mangledOperations


module.exports = OperationsMangler
