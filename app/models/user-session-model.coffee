_           = require 'lodash'
url         = require 'url'
async       = require 'async'
nodefn      = require 'when/node'
MeshbluHTTP = require 'meshblu-http'
debug       = require('debug')('octoblu:user-session-model')

class UserSession
  @ERROR_DEVICE_NOT_FOUND: 'Meshblu device not found'
  @ERROR_FAILED_TO_GET_SESSION_TOKEN: 'Failed to get session token'
  @ERROR_FAILED_TO_UPDATE_DEVICE: 'Failed to update device'

  constructor: (dependencies={}) ->
    @config  = dependencies.config ? require '../../config/auth'
    @databaseConfig = dependencies.databaseConfig ? require '../../config/database'
    @users = dependencies.database?.users ? require('../lib/database').getCollection('users')

  create: (uuid, token, callback=->) =>
    debug '->create'
    @exchangeOneTimeTokenForSessionToken uuid, token, (error, sessionToken) =>
      debug 'exchange one time token', { error, sessionToken }
      return callback error if error?

      @ensureUserExists uuid, (error, user) =>
        debug 'ensure user exists', { error, user }
        return callback error, user, sessionToken

  createNewSessionToken: (uuid, token, callback) =>
    debug '->createNewSessionToken', { uuid, token }
    meshbluHTTP = @_getMeshbluHTTP {uuid, token}
    meshbluHTTP.generateAndStoreToken uuid, (error, response) =>
      debug 'generate and store token result', { error, response }
      return callback error if error?
      callback null, response.token

  createUser: (uuid, callback=->) =>
    debug '->createUser', { uuid }
    @users
      .insert {skynet: {uuid: uuid}, resource: {uuid: uuid}}
      .then  (user)  =>
        debug 'got user', { user }
        return callback null, user[0] if _.isArray user
        callback null, user
      .catch (error) => callback error

  ensureUserExists: (uuid, callback=->) =>
    debug '->ensureUserExists', { uuid }
    @getUserByUuid uuid, (error, user) =>
      debug 'got user by uuid', { error, user }
      return callback error if error?
      return callback null, user if user?
      @createUser uuid, callback

  exchangeOneTimeTokenForSessionToken: (uuid, token, callback=->) =>
    debug '->exchangeOneTimeTokenForSessionToken', { uuid, token }
    @createNewSessionToken uuid, token, (error, sessionToken) =>
      debug 'created session token', { error, sessionToken }
      return callback error if error?

      @invalidateOneTimeToken uuid, token, (error) =>
        debug 'created one time token', { error }
        return callback error if error?
        callback null, sessionToken

  getDeviceFromMeshblu: (uuid, token, callback=->) =>
    debug '->getDeviceFromMeshblu', { uuid, token }
    @_meshbluGetDevice uuid, token, (error, device) =>
      debug 'got device from meshblu', { error, device }
      return callback error if error?
      return callback new Error(UserSession.ERROR_DEVICE_NOT_FOUND) unless device?
      callback null, device

  getUserByUuid: (uuid, callback=->) =>
    debug '->getUserByUuid', { uuid }
    nodefn.bindCallback @users.findOne({ 'skynet.uuid': uuid }), callback

  invalidateOneTimeToken: (uuid, token, callback=->) =>
    debug '->invalidateOneTimeToken', { uuid, token }
    meshbluHTTP = @_getMeshbluHTTP {uuid, token}
    meshbluHTTP.revokeToken uuid, token, callback

  updateDevice: (uuid, token, device, callback=->) =>
    debug '->updateDevice', { uuid, token }
    meshbluHttp = @_getMeshbluHTTP { uuid, token }
    meshbluHttp.update uuid, device, callback

  _meshbluCreateSessionToken: (uuid, token, callback=->) =>
    debug '->_meshbluCreateSessionToken', { uuid, token }
    meshbluHttp = @_getMeshbluHTTP { uuid, token }
    meshbluHttp.generateAndStoreToken uuid, callback

  _meshbluGetDevice: (uuid, token, callback=->) =>
    debug '->_meshbluGetDevice', { uuid, token }
    meshbluHttp = @_getMeshbluHTTP { uuid, token }
    meshbluHttp.whoami callback

  _getMeshbluHTTP: ({uuid, token}) =>
    debug '_getMeshbluHTTP', { uuid, token, skynet: @config.skynet }
    return new MeshbluHTTP {
      uuid,
      token,
      hostname: @config.skynet.hostname,
      port: @config.skynet.port,
      protocol: @config.skynet.protocol
    }


module.exports = UserSession
