_ = require 'lodash'
UserSession = require '../../models/user-session-model'
basicAuth = require 'basic-auth'
debug = require('debug')('octoblu:security-controller')


class SecurityController
  constructor: (dependencies={}) ->
    @userSession = dependencies.userSession ? new UserSession
    @MESHBLU_CONNECTION_ERROR="Error connecting to meshblu"

  bypassAuth: (request, response, next=->) =>
    request.bypassAuth = true
    next()

  bypassTerms: (request, response, next=->) =>
    request.bypassTerms = true
    next()

  enforceTerms: (request, response, next=->) =>
    return next() if request.bypassTerms
    return next() unless request.user?
    return response.status(401).end() unless request.user.userDevice?
    return response.status(401).end() if request.user.userDevice.error?

    userAcceptedDate = new Date(request.user.userDevice?.octoblu?.termsAcceptedAt ? null)
    termsDate = new Date '2015-02-13T22:00:00.000Z'
    return next() if userAcceptedDate.getTime() >= termsDate.getTime()

    response.status(403).send 'Terms of service must be accepted'

  getAuthFromHeaders: (request) =>
    headers = request.headers ? {}
    debug 'getAuthFromHeaders', headers

    uuid  = headers.skynet_auth_uuid ? headers.meshblu_auth_uuid
    token = headers.skynet_auth_token ? headers.meshblu_auth_token

    return uuid: uuid, token: token

  getAuthFromCookies: (request) =>
    cookies = request.cookies ? {}
    debug 'getAuthFromCookies', cookies

    return uuid: cookies.meshblu_auth_uuid, token: cookies.meshblu_auth_token

  getAuthFromBasic: (request) =>
    return {} unless request.headers?
    auth = basicAuth request
    debug 'getAuthFromBasic', auth
    return {} unless auth?
    {name, pass} = auth
    return {} unless name && pass
    return uuid: name, token: pass

  getAuthFromBearer: (request) =>
    return {} unless request.headers?
    parts = request.headers.authorization?.split(' ')
    debug 'getAuthFromBearer', parts
    return {} unless parts? && parts[0] == 'Bearer'

    auth = new Buffer(parts[1], 'base64').toString().split(':')
    uuid = auth[0]
    token = auth[1]
    return {} unless uuid && token

    return uuid: uuid, token: token

  getAuthFromAnywhere: (request) =>
    {uuid, token} = @getAuthFromHeaders(request)
    {uuid, token} = @getAuthFromBearer(request) unless uuid && token
    {uuid, token} = @getAuthFromBasic(request) unless uuid && token
    {uuid, token} = @getAuthFromCookies(request) unless uuid && token
    debug 'getAuthFromAnywhere', uuid, token
    return uuid: uuid, token: token

  authenticateWithMeshblu: (uuid, token, callback=->) =>
    debug 'authenticateWithMeshblu', uuid, token
    return callback new Error('No UUID or Token found') unless uuid && token
    @userSession.getDeviceFromMeshblu uuid, token, (error, userDevice) =>
      debug 'gotDeviceFromMeshblu'
      return callback new Error(@MESHBLU_CONNECTION_ERROR) if error?
      @userSession.ensureUserExists uuid, (error, user) =>
        return callback error if error?
        callback null, user, userDevice

  isAuthenticated: (request, response, next=->) =>
    return next() if request.bypassAuth
    {uuid, token} = @getAuthFromAnywhere request

    authenticateCallback = (error, user, userDevice) =>
      return response.status(502).send(error: error.message) if error && error.message == @MESHBLU_CONNECTION_ERROR
      return response.status(401).send(error: error.message) if error?
      return response.status(404).send(error: 'user not found') unless user?
      user.userDevice = userDevice
      request.uuid = uuid
      request.token = token
      request.user = user
      next()

    @authenticateWithMeshblu uuid, token, authenticateCallback

module.exports = SecurityController
