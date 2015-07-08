url = require 'url'
async = require 'async'
bcrypt = require 'bcrypt'
_ = require 'lodash'
debug = require('debug')('octoblu:user-session-model')
nodefn = require 'when/node'

class UserSession
  @ERROR_DEVICE_NOT_FOUND: 'Meshblu device not found'
  @ERROR_FAILED_TO_GET_SESSION_TOKEN: 'Failed to get session token'
  @ERROR_FAILED_TO_UPDATE_DEVICE: 'Failed to update device'

  constructor: (dependencies={}) ->
    @request = dependencies.request ? require 'request'
    @config  = dependencies.config ? require '../../config/auth'
    @databaseConfig = dependencies.databaseConfig ? require '../../config/database'
    @users = dependencies.database?.users ? require('../lib/database').getCollection('users')
    if @databaseConfig?.redisSessionUrl?
      @redis = dependencies.redis ? require 'redis'
      @parseRedis = require('parse-redis-url')()
      @redisClient = @redis.createClient @parseRedis.parse(@databaseConfig.redisSessionUrl)

  create: (uuid, token, callback=->) =>
    @exchangeOneTimeTokenForSessionToken uuid, token, (error, sessionToken) =>
      return callback error if error?

      @ensureUserExists uuid, (error, user) =>
        return callback error, user, sessionToken

  createNewSessionToken: (uuid, token, callback) =>
    debug('createNewSessionToken', uuid, token)
    @_meshbluCreateSessionToken uuid, token, (error, response, body) =>
      return callback error if error?
      return callback new Error(UserSession.ERROR_FAILED_TO_GET_SESSION_TOKEN) unless response.statusCode == 200
      callback null, body.token

  createUser: (uuid, callback=->) =>
    @users
      .insert {skynet: {uuid: uuid}, resource: {uuid: uuid}}
      .then  (user)  =>
        return callback null, user[0] if _.isArray user
        callback null, user
      .catch (error) => callback error

  ensureUserExists: (uuid, callback=->) =>
    @getUserByUuid uuid, (error, user) =>
      return callback error if error?
      return @getUserByUuid uuid, callback if user?
      @createUser uuid, callback

  exchangeOneTimeTokenForSessionToken: (uuid, token, callback=->) =>
    @createNewSessionToken uuid, token, (error, sessionToken) =>
      return callback error if error?

      @invalidateOneTimeToken uuid, token, (error) =>
        return callback error if error?
        callback null, sessionToken

  getDeviceFromMeshblu: (uuid, token, callback=->) =>
    @_meshbluGetDevice uuid, token, (error, device) =>
      return callback error if error?
      return callback new Error(UserSession.ERROR_DEVICE_NOT_FOUND) unless device?

      callback null, device

  getUserByUuid: (uuid, callback=->) =>
    nodefn.bindCallback @users.findOne('skynet.uuid': uuid), callback

  invalidateOneTimeToken: (uuid, token, callback=->) =>
    rejectToken = (tokenObj, cb=->) =>
      bcrypt.compare token, tokenObj.hash, (error, result) =>
        cb result

    debug 'invalidateOneTimeToken', uuid, token
    @getDeviceFromMeshblu uuid, token, (error, device) =>
      return callback error if error?

      deviceTokens = device.tokens ? []
      async.reject deviceTokens, rejectToken, (tokens) =>
        @updateDevice uuid, token, {uuid: uuid, tokens: tokens}, callback

  updateDevice: (uuid, token, device, callback=->) =>
    @_meshbluRequest uuid, token, 'PUT', "/devices/#{uuid}", device, (error, response) =>
      return callback error if error?
      return callback new Error(UserSession.ERROR_FAILED_TO_UPDATE_DEVICE) unless response.statusCode == 200
      callback()

  _meshbluCreateSessionToken: (uuid, token, callback=->) =>
    @_meshbluRequest uuid, token, 'POST', "/devices/#{uuid}/tokens", callback

  _meshbluGetDevice: (uuid, token, callback=->) =>
    debug '_meshbluGetDevice', uuid, token
    @_findDeviceInCache uuid, token, (error, device) =>
      debug 'foundDevice', device?.uuid
      return callback null, device if device?
      @_meshbluRequest uuid, token, 'GET', "/v2/whoami", (error, response, device) =>
        @_addDeviceToCache uuid, token, device if device?
        callback error, device

  _meshbluRequest: (uuid, token, method, path, json=true, callback=->) =>
    if _.isFunction json
      callback = json
      json = true

    {host, port} = @config.skynet

    options = {
      uri: url.format({
        protocol: if port == 443 then 'https' else 'http'
        hostname: host
        port:     port
        pathname: path
      })
      method: method
      headers:
        meshblu_auth_uuid:  uuid
        meshblu_auth_token: token
      json: json
    }

    @request options, callback

  _addDeviceToCache: (uuid, token, device, callback=->) =>
    return callback null unless @redisClient?
    debug 'addDeviceToCache', uuid, token
    @redisClient.setex "#{uuid}-#{token}", 30, JSON.stringify(device), callback

  _findDeviceInCache: (uuid, token, callback=->) =>
    return callback null unless @redisClient?
    debug 'findDeviceInCache', uuid, token
    @redisClient.get "#{uuid}-#{token}", (error, reply) =>
      debug 'foundDeviceInCache', uuid, token
      return callback error if error?
      return callback null unless reply?
      callback null, JSON.parse(reply)

module.exports = UserSession
