THREE_MONTHS_IN_MS=1000*60*60*24*30*3

class SessionController
  @ERROR_RETRIEVING_SESSION = 'Error retrieving session'
  constructor: (@dependencies={}) ->
    @dependencies.UserSession ?= require '../models/user-session-model'

  show: (request, response) =>
    {uuid,token,callbackUrl} = request.query
    userSession = new @dependencies.UserSession
    userSession.create uuid, token, (error, user, sessionToken) =>
      if error?
        return response.status(500).send SessionController.ERROR_RETRIEVING_SESSION unless error.code?
        return response.sendStatus(error.code) if error.code? && error.message = 'Unknown Error Occurred'
        response.sendError error
        return

      request.user = user
      response.cookie 'meshblu_auth_uuid', uuid, {maxAge: THREE_MONTHS_IN_MS}
      response.cookie 'meshblu_auth_token', sessionToken, {maxAge: THREE_MONTHS_IN_MS}
      response.redirect(callbackUrl ? '/')

module.exports = SessionController
