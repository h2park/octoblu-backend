url = require 'url'
async = require 'async'
_ = require 'lodash'
debug = require('debug')('octoblu:user-session-model')
nodefn = require 'when/node'
MeshbluHTTP = require 'meshblu-http'

class UserSession
  @ERROR_DEVICE_NOT_FOUND: 'Meshblu device not found'
  @ERROR_FAILED_TO_GET_SESSION_TOKEN: 'Failed to get session token'
  @ERROR_FAILED_TO_UPDATE_DEVICE: 'Failed to update device'

  constructor: (dependencies={}) ->
    @request = dependencies.request ? require 'request'
    @config  = dependencies.config ? require '../../config/auth'
    @databaseConfig = dependencies.databaseConfig ? require '../../config/database'
    @users = dependencies.database?.users ? require('../lib/database').getCollection('users')

  create: (uuid, token, callback=->) =>
    @exchangeOneTimeTokenForSessionToken uuid, token, (error, sessionToken) =>
      return callback error if error?

      @ensureUserExists uuid, (error, user) =>
        return callback error, user, sessionToken

  createNewSessionToken: (uuid, token, callback) =>
    debug('createNewSessionToken', uuid, token)
    meshbluHTTP = @_getMeshbluHTTP {uuid, token}
    meshbluHTTP.generateAndStoreToken uuid, (error, response) =>
      return callback error if error?
      callback null, response.token

  createUser: (uuid, callback=->) =>
    @users
      .insert {skynet: {uuid: uuid}, resource: {uuid: uuid}}
      .then  (user)  =>
        return callback null, user[0] if _.isArray user
        callback null, user
      .catch (error) => callback error

  ensureUserExists: (uuid, callback=->) =>
    debug 'ensureUserExists', uuid
    @getUserByUuid uuid, (error, user) =>
      return callback error if error?
      return callback null, user if user?
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
    meshbluHTTP = @_getMeshbluHTTP {uuid, token}
    meshbluHTTP.revokeToken uuid, token, (error) =>
      callback error

  updateDevice: (uuid, token, device, callback=->) =>
    @_meshbluRequest uuid, token, 'PUT', "/devices/#{uuid}", device, (error, response) =>
      return callback error if error?
      return callback new Error(UserSession.ERROR_FAILED_TO_UPDATE_DEVICE) unless response.statusCode == 200
      callback()

  _meshbluCreateSessionToken: (uuid, token, callback=->) =>
    @_meshbluRequest uuid, token, 'POST', "/devices/#{uuid}/tokens", callback

  _meshbluGetDevice: (uuid, token, callback=->) =>
    debug '_meshbluGetDevice', uuid, token
    @_meshbluRequest uuid, token, 'GET', "/v2/whoami", (error, response, device) =>
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

  _getMeshbluHTTP: ({uuid, token}) =>
    new MeshbluHTTP
      uuid: uuid
      token: token
      server: @config.skynet.host
      port: @config.skynet.port

module.exports = UserSession
