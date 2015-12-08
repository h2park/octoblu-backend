_ = require 'lodash'
UserSession = require '../../models/user-session-model'
debug = require('debug')('octoblu:security-controller')

class SecurityController
  constructor: (dependencies={}) ->
    @userSession = dependencies.userSession ? new UserSession
    @MESHBLU_CONNECTION_ERROR="Error connecting to meshblu"

  enforceTerms: (request, response, next=->) =>
    return next() unless request.user?
    return response.status(401).end() unless request.user.userDevice?
    return response.status(401).send(request.user.userDevice.error.message) if request.user.userDevice.error?
    return response.status(401).end() unless request.user.userDevice.uuid == request.meshbluAuth.uuid

    userAcceptedDate = new Date(request.user.userDevice?.octoblu?.termsAcceptedAt ? null)
    termsDate = new Date '2015-02-13T22:00:00.000Z'
    return next() if userAcceptedDate.getTime() >= termsDate.getTime()

    response.status(403).send 'Terms of service must be accepted'

  isAuthenticated: (request, response, next=->) =>
    @userSession.getDeviceFromMeshblu request.meshbluAuth.uuid, request.meshbluAuth.token, (error, userDevice) =>
      return response.status(502).send(error: error.message) if error && error.message == @MESHBLU_CONNECTION_ERROR
      return response.status(401).send(error: error.message) if error?
      @userSession.ensureUserExists userDevice.uuid, (error, user) =>
        return response.status(401).send(error: error.message) if error?
        return response.status(404).send(error: 'user not found') unless user?
        user.userDevice = userDevice
        request.uuid = request.meshbluAuth.uuid
        request.token = request.meshbluAuth.token
        request.user = user
        debug 'setting request.user', user?.resource?.uuid, user?.userDevice?.uuid
        next()

module.exports = SecurityController
